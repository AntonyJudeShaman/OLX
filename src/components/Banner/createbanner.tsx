import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button } from "../ui/button";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { MinusIcon, PlusIcon } from "lucide-react";
import { app, auth } from "../../lib/firebase";
import toast from "react-hot-toast";
import MyToast from "../ui/my-toast";
import { useNavigate } from "react-router-dom";

interface Banner {
  banners: File[];
}

export default function CreateBanner({
  initialBanners = [],
  bannerLimit = 3,
}: {
  initialBanners?: string[];
  bannerLimit?: number;
}) {
  const [banner, setBanner] = useState<Banner>({
    banners: [],
  });
  const [existingBanners, setExistingBanners] =
    useState<string[]>(initialBanners);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (initialBanners.length > 0) {
      setExistingBanners(initialBanners);
    }
  }, [initialBanners]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalBanners =
        existingBanners.length + banner.banners.length + files.length;
      if (totalBanners > bannerLimit) {
        MyToast({
          message: `You can only upload up to ${bannerLimit} images`,
          type: "error",
        });
        return;
      }
      setBanner((prevBanner) => ({
        ...prevBanner,
        banners: [...prevBanner.banners, ...files],
      }));
    }
    setLoading(false);
  };

  const updateMongoDB = async (updatedBanners: string[]) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user?.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            banners: updatedBanners,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update DB");
      }

      setLoading(false);
      return await response.json();
    } catch (error) {
      MyToast({ message: "Error updating DB", type: "error" });

      setLoading(false);
    }
  };

  const handleImageRemoval = async (index: number, isExisting: boolean) => {
    try {
      if (isExisting) {
        setLoading(true);
        const imageUrl = existingBanners[index];
        const storage = getStorage(app);
        const imageRef = ref(storage, imageUrl);

        await deleteObject(imageRef);

        const updatedBanners = existingBanners.filter((_, i) => i !== index);
        setExistingBanners(updatedBanners);

        await updateMongoDB(updatedBanners);

        setLoading(false);
        MyToast({ message: "Image deleted successfully", type: "success" });
      } else {
        setLoading(false);
        setBanner((prevBanner) => ({
          ...prevBanner,
          banners: prevBanner.banners.filter((_, i) => i !== index),
        }));
      }
    } catch (error) {
      setLoading(false);
      MyToast({ message: "Error deleting image", type: "error" });
    }
  };

  const uploadBannersToFirebase = async (banners: File[]) => {
    setLoading(true);
    const storage = getStorage(app);
    const imageURLs: string[] = [];

    for (let index = 0; index < banners.length; index++) {
      const image = banners[index];
      try {
        const storageRef = ref(
          storage,
          `banners/${user?.uid}/${Date.now()}-${image.name}`
        );
        const snapshot = await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageURLs.push(downloadURL);
        setLoading(false);
      } catch (error) {
        MyToast({ message: "Error uploading banners", type: "error" });

        setLoading(false);
      }
    }

    setLoading(false);
    return imageURLs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoading(true);
      const totalBanners = existingBanners.length + banner.banners.length;
      if (totalBanners === 0) {
        MyToast({ message: "Please upload at least one image", type: "error" });
        return;
      }

      if (totalBanners > bannerLimit) {
        MyToast({
          message: `Upload limit is at most ${bannerLimit} images`,
          type: "error",
        });
        setLoading(false);
        return;
      }

      toast.loading("Uploading banners...");

      const newImageURLs = await uploadBannersToFirebase(banner.banners);
      const allBanners = [...existingBanners, ...newImageURLs];

      toast.dismiss();
      toast.loading("Updating Banner...");

      await updateMongoDB(allBanners);

      toast.dismiss();
      MyToast({ message: "Banner updated successfully", type: "success" });
      setBanner({ banners: [] });
      setExistingBanners(allBanners);
      setLoading(false);
    } catch (error) {
      toast.dismiss();
      MyToast({ message: "Cannot update Banner", type: "error" });
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen mx-auto">
        <div className="flex flex-col mx-auto rounded-2xl border mt-[10rem] border-gray-300 p-10">
          <p className="text-md">
            Please signup or login to sell Banners on OLX
          </p>
          <Button onClick={() => navigate("/login")} className="mt-4">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 md:container w-full">
        <div className="mx-auto">
          {" "}
          <p className="text-md font-semibold text-red-600 mb-6 -mt-4">
            {existingBanners.length + banner.banners.length} / {bannerLimit}{" "}
            banners uploaded
          </p>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <div className="grid grid-cols-1  md:grid-cols-3 gap-2">
                {existingBanners.map((image, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative overflow-hidden rounded-md"
                  >
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="object-cover w-100 h-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemoval(index, true)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {banner.banners.map((image, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative overflow-hidden rounded-md"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemoval(index, false)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {existingBanners.length + banner.banners.length <
                  bannerLimit && (
                  <label
                    htmlFor="image-upload"
                    className="flex aspect-square items-center justify-center rounded-md border-2 border-dashed border-muted-foreground cursor-pointer"
                  >
                    <PlusIcon className="h-6 w-6 text-muted-foreground" />
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                existingBanners.length + banner.banners.length === 0 ||
                loading ||
                existingBanners.length === bannerLimit
              }
            >
              Update Banner
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
