import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyToast from "../ui/my-toast";
import { Button } from "../ui/button";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  userId: string;
}

interface Props {
  userId: string;
}

const YourProducts: React.FC<Props> = ({ userId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemsByUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/items/user/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        // skipping
      }
    };

    fetchItemsByUser();
  }, [userId]);

  const handleDelete = async (itemId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items/${itemId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      setItems(items.filter((item) => item._id !== itemId));
      MyToast({ message: "Item deleted successfully", type: "success" });
    } catch (error) {
      MyToast({ message: "Error deleting item", type: "error" });
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div
            key={item._id}
            className="relative overflow-hidden hover:border hover:border-gray-300 border border-teal-800 rounded-2xl shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out"
          >
            <Link to={`/items/${item._id}`} className="absolute inset-0 z-10">
              <span className="sr-only">View {item.title}</span>
            </Link>
            <img
              src={item.images[0]}
              alt={item.title}
              className="object-cover w-full h-72"
            />
            <div className="p-4 bg-background">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </p>
              <h4 className="text-lg font-semibold">₹ {item.price}</h4>
              <div className="flex space-x-4 mt-2">
                <Button
                  onClick={() => navigate(`/edit-item/${item._id}`)}
                  className="bg-blue-500 z-20 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 z-20 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourProducts;
