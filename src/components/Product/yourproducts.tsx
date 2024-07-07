import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyToast from "../ui/my-toast";
import { Button } from "../ui/button";
import { useAuth } from "../../lib/auth";
import Logout from "../logout";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  userId: string;
}

const YourProducts: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
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
        setItems(data);
      } catch (error) {
        MyToast({ message: "Error fetching items", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchItemsByUser();
    }
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
    } finally {
      setDeleteItemId(null);
    }
  };

  if (loading || !user?.uid) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {!loading && items.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          {user?.userType === "seller" ? (
            <>
              <p className="text-xl text-gray-700 mb-6">
                You have no products yet. Start selling by creating a new
                product!
              </p>
              <Button
                onClick={() => navigate("/sell")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create new product
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-xl text-gray-700 mb-6">
                Please sign up as a seller to create products.
              </p>
              <Logout />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              className={`${"bg-white text-gray-900"} overflow-hidden shadow-lg rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
            >
              <div className="relative h-64">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Link
                    to={`/items/${item._id}`}
                    className="text-white text-lg font-semibold hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.category.charAt(0).toUpperCase() +
                    item.category.slice(1)}
                </p>
                <p className="text-lg font-semibold text-blue-600 mb-4">
                  ₹{item.price.toLocaleString()}
                </p>
                <div className="flex space-x-4">
                  <Button
                    onClick={() => navigate(`/edit-item/${item._id}`)}
                    className="flex-1 bg-green-500 hover:bg-green-600 focus:ring-green-500"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="flex-1 bg-red-500 hover:bg-red-600 focus:ring-red-500"
                        onClick={() => setDeleteItemId(item._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your product from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            deleteItemId && handleDelete(deleteItemId)
                          }
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
