import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
    <section className="mx-auto py-12">
      <div className="grid gap-8">
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Discover Our Collection
          </h1>
          <p className="text-muted-foreground">
            Explore our carefully selected products across various categories.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative overflow-hidden hover:border hover:border-gray-300 border border-teal-800 rounded-2xl shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out"
            >
              <Link
                to={`/items/${product._id}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">View {product.title}</span>
              </Link>
              {/* {product.images.map((image) => ( */}
              <img
                src={product.images[0]}
                alt={product.title}
                className="object-cover w-full h-72"
              />
              {/* ))} */}
              <div className="p-4 bg-background">
                <h3 className="text-xl font-bold">{product.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)}
                </p>
                <h4 className="text-lg font-semibold">₹ {product.price}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
