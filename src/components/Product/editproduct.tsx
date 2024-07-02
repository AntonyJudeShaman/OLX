import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MyToast from "../ui/my-toast";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../lib/firebase";
import toast from "react-hot-toast";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

const EditItem = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    images: [""],
  });
  const [newImage, setNewImage] = useState<File | null>(null); // Updated to File type
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `http://localhost:10000/api/items/${itemId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch item");
        }
        const data = await response.json();
        setItem(data);
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          images: data.images,
        });
      } catch (error) {
        MyToast({ message: "Error fetching item", type: "error" });
      }
    };

    fetchItem();
  }, [itemId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageRemoval = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const uploadImageToFirebase = async (image: File): Promise<string> => {
    const storage = getStorage(app);
    try {
      const storageRef = ref(storage, `product-images/${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      MyToast({ message: "Error uploading image", type: "error" });
      throw error;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    toast.loading("Uploading images...", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        fontSize: "14px",
      },
      iconTheme: {
        primary: "lightgreen",
        secondary: "black",
      },
    });
    if (file) {
      try {
        const imageURL = await uploadImageToFirebase(file);
        setFormData({
          ...formData,
          images: [...formData.images, imageURL],
        });
        toast.dismiss();
        MyToast({ message: "Image uploaded successfully", type: "success" });
      } catch (error) {
        toast.dismiss();
        MyToast({ message: "Error uploading image", type: "error" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:10000/api/items/${itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update item");
      }
      MyToast({ message: "Item updated successfully", type: "success" });
      navigate(`/items/${itemId}`);
    } catch (error) {
      MyToast({ message: "Error updating item", type: "error" });
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Title
          </Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 shadow-md rounded-md"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Description
          </Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 shadow-md rounded-md"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Price
          </Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 shadow-md rounded-md"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Category
          </Label>
          <Input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 shadow-md rounded-md"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Add New Image
          </Label>
          <div className="flex space-x-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full border border-gray-300 shadow-md rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`${formData.title} - Image ${index + 1}`}
                className="rounded-2xl shadow-lg object-cover w-full cursor-pointer hover:opacity-80 transition-opacity duration-300 ease-in-out"
              />
              <button
                type="button"
                onClick={() => handleImageRemoval(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
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
        </div>
        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Item
        </Button>{" "}
        <Button
          type="button"
          onClick={() => navigate(`/profile`)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default EditItem;
