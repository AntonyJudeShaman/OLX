import { useState, useEffect } from "react";
import Products from "./product";

interface Product {
  _id: number;
  title: string;
  price: number;
  category: string;
  images: string[];
}

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
          method: "GET",
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="mx-auto">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Top Deals of the day
        </h1>
        <p className="text-muted-foreground">
          Explore our carefully selected products across various categories.
        </p>
      </div>
      <div className="py-12">
        <Products products={products.slice(0, 4)} />
      </div>

      <div className="grid gap-2 mt-[4rem]">
        <h1 className="text-3xl font-bold tracking-tight">
          Top selling products{" "}
        </h1>
        <p className="text-muted-foreground">
          Explore our carefully selected products across various categories.
        </p>
      </div>
      <div className="py-12">
        <Products products={products.slice(4, 8)} />
      </div>
    </section>
  );
}
