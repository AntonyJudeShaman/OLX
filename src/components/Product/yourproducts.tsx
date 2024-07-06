import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyToast from "../ui/my-toast";
import { Button } from "../ui/button";
import { useAuth } from "../../lib/auth";
import Logout from "../logout";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  userId: string;
}

const YourProducts = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAuth();

  useEffect(() => {
    const fetchItemsByUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/items/user/${user?.uid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setLoading(false);
        setItems(data);
      } catch (error) {
        // skipping
        setLoading(false);
      }
    };

    fetchItemsByUser();
  }, [user?.uid]);

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

  if (loading || !user?.uid) {
    return (
      <div className="container mt-12 p-10 mx-auto">
        <p className="text-center text-xl text-green-800 font-bold">
          Loading Please wait...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      {!loading && items.length === 0 ? (
        <div className="border border-red-400 bg-red-200 rounded-2xl p-10 mx-auto">
          {user?.userType === "seller" ? (
            <>
              <p className="text-center text-xl text-red-800 font-bold">
                You have no products. You can create a new product by clicking
                on the button below.
              </p>
              <Button
                onClick={() => navigate("/sell")}
                className="mt-4 mx-auto flex"
              >
                Create new product
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-center text-xl mb-4 text-red-800 font-bold">
                Please sign up as a seller to create products.
              </p>
              <Logout />
            </div>
          )}
        </div>
      ) : (
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
                  {item.category.charAt(0).toUpperCase() +
                    item.category.slice(1)}
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
      )}
    </div>
  );
};

export default YourProducts;
