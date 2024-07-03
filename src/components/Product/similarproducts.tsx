import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  currentItemId?: string;
  className?: string;
}

const SimilarProducts: React.FC<Props> = ({
  category,
  className,
  currentItemId,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemsByCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/items/category/${category}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        if (currentItemId) {
          const filteredItems = data.filter((item: Item) => {
            return item._id !== currentItemId;
          });
          setItems(filteredItems);
        } else setItems(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchItemsByCategory();
  }, [category]);

  return (
    <div className={cn("mx-auto w-full py-12", className)}>
      {!loading && items.length === 0 ? (
        <p className="text-center text-xl text-muted-foreground border border-red-400 bg-red-200 text-red-800 font-bold rounded-2xl p-10 mx-auto my-auto">
          No products founds in this category. Please try again.
        </p>
      ) : (
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
                  {item.category.charAt(0).toUpperCase() +
                    item.category.slice(1)}
                </p>
                <h4 className="text-lg font-semibold">₹ {item.price}</h4>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilarProducts;
