import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { cn } from "../../lib/utils";
import Products from "./product";

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
  const [loading, setLoading] = useState(true);

  const itemId = useParams<{ id: string }>().id;

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
        if (itemId) {
          const filteredItems = data.filter((item: Item) => {
            return item._id !== itemId;
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
        <Products products={items} />
      )}
    </div>
  );
};

export default SimilarProducts;
