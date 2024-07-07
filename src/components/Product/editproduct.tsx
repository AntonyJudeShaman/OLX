import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MyToast from "../ui/my-toast";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { MinusCircle, PlusCircle, Upload, X } from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../lib/firebase";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

const categories = [
  "electronics",
  "clothing",
  "furniture",
  "Home Appliances",
  "Accessories",
  "Garden",
  "sports",
  "Books",
  "Toys & Games",
  "Beauty & Personal Care",
  "Other",
];

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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/items/${itemId}`
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
      } finally {
        setIsLoading(false);
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

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
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
    if (file) {
      toast.loading("Uploading image...");
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
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items/${itemId}`,
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!item)
    return (
      <div className="text-center text-2xl text-gray-600">Item not found</div>
    );

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Edit Item</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <Label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <div className="mt-1">
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </Label>
            <div className="mt-1">
              <Input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </Label>
            <div className="mt-1">
              <Select
                onValueChange={handleCategoryChange}
                defaultValue={formData.category}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`${formData.title} - Image ${index + 1}`}
                  className="h-40 w-full object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemoval(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-600">
                  Add Image
                </span>
              </div>
              <input
                id="image-upload"
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={() => navigate(`/profile`)}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Item"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditItem;
