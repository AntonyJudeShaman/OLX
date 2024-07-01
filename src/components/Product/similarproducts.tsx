import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MyToast from "../ui/my-toast";
import { cn } from "../../lib/utils";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

interface Props {
  category: string;
  className?: string;
}

const SimilarProducts: React.FC<Props> = ({ category, className }) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItemsByCategory = async () => {
      try {
        const response = await fetch(
          `http://localhost:10000/api/items/category/${category}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        MyToast({ message: "Error fetching items", type: "error" });
      }
    };

    fetchItemsByCategory();
  }, [category]);

  return (
    <div className={cn("mx-auto w-full py-12", className)}>
      <div className="grid grid-cols-1 w-full lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <Link
            to={`/items/${item._id}`}
            key={item._id}
            className="relative overflow-hidden hover:border hover:border-gray-300 border border-teal-800 rounded-2xl shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out"
          >
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
