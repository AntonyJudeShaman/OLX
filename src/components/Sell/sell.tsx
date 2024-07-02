import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MinusIcon, PlusIcon } from "lucide-react";
import { app, auth } from "../../lib/firebase";
import toast from "react-hot-toast";
import MyToast from "../ui/my-toast";
import { useNavigate } from "react-router-dom";

interface Product {
  title: string;
  description: string;
  price: number;
  category: string;
  images: File[];
}

export default function Sell() {
  const [product, setProduct] = useState<Product>({
    title: "",
    description: "",
    price: 0,
    category: "",
    images: [],
  });

  const user = auth.currentUser;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSelectInputChange = (value: string) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, ...files],
      }));
    }
  };

  const handleImageRemoval = (index: number) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: prevProduct.images.filter((_, i) => i !== index),
    }));
  };

  const uploadImagesToFirebase = async (images: File[]) => {
    const storage = getStorage(app);
    const imageURLs: string[] = [];

    for (const image of images) {
      try {
        const storageRef = ref(storage, `product-images/${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageURLs.push(downloadURL);
      } catch (error) {
        MyToast({ message: "Error uploading images", type: "error" });
      }
    }

    return imageURLs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (product.images.length === 0) {
        MyToast({ message: "Please upload at least one image", type: "error" });
        return;
      }

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

      const imageURLs = await uploadImagesToFirebase(product.images);

      toast.dismiss();
      toast.loading("Creating product...", {
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

      const uploadProductToDB = await fetch(
        `${import.meta.env.VITE_API_URL}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: product.title,
            userId: user?.uid,
            description: product.description,
            price: product.price,
            category: product.category,
            images: imageURLs,
          }),
        }
      );

      if (uploadProductToDB.ok) {
        toast.dismiss();
        MyToast({ message: "Product created successfully", type: "success" });
        setProduct({
          title: "",
          description: "",
          price: 0,
          category: "",
          images: [],
        });
        console.log("New product:", await uploadProductToDB.json());
      } else {
        throw new Error("Error creating product");
      }
    } catch (error) {
      toast.dismiss();
      MyToast({ message: "Cannot create product", type: "error" });
      console.error("Error creating product:", error);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {user?.uid ? (
        <main className="flex-1 bg-muted/40 p-4 md:p-6">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold mb-4">Create a new product</h1>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={product.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  required
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="category"
                    value={product.category}
                    required
                    onValueChange={handleSelectInputChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="home appliances">
                        Home Appliances
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="images">Images</Label>
                <div className="grid grid-cols-3 gap-2">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-md"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Image ${index + 1}`}
                        className="object-cover"
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
              </div>
              <Button type="submit" className="w-full">
                Create Product
              </Button>
            </form>
          </div>
        </main>
      ) : (
        <div className="min-h-screen mx-auto">
          <div className="flex flex-col mx-auto rounded-2xl border mt-[10rem] border-gray-300 p-10">
            <p className="text-md">
              Please signup or login to sell products on OLX
            </p>
            <Button onClick={() => navigate("/login")} className="mt-4">
              Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
