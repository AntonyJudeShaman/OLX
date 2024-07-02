import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import SimilarProducts from "./similarproducts";
import { auth } from "../../lib/firebase";

interface Product {
  _id?: string;
  userId?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

interface User {
  id?: string;
  name: string;
  phone: string;
}

const ProductInfo = () => {
  const [product, setProduct] = useState<Product>({
    title: "",
    description: "",
    price: 0,
    category: "",
    images: [],
  });
  const [mainImage, setMainImage] = useState<string>("");
  const [user, setUser] = useState<User>({ name: "", phone: "" });

  let { id } = useParams<{ id: string }>();

  const userSession = auth.currentUser;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/items/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }
        const data: Product = await res.json();
        setProduct(data);
        setMainImage(data.images[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${product.userId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchUser();
  }, [product]);

  return (
    <>
      {" "}
      {product.userId && user.name && user.phone && (
        <div className="container mx-auto py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center items-center">
              <img
                src={mainImage}
                alt={product.title}
                className="rounded-2xl shadow-lg object-cover w-full"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-5xl font-bold tracking-tighter mb-4">
                {product.title}
              </h1>
              <p className="text-muted-foreground text-xl mb-4">
                {product.description}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Category:{" "}
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
              </p>
              <p className="text-lg font-semibold mb-4">₹ {product.price}</p>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <img
                    onClick={() => setMainImage(image)}
                    key={index}
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="rounded-2xl shadow-lg object-cover w-full cursor-pointer hover:opacity-80 transition-opacity duration-300 ease-in-out"
                  />
                ))}
              </div>
              {user.name && user.phone && (
                <div className="mt-10 space-y-3">
                  <p className="text-3xl font-bold tracking-tight">
                    Seller Info
                  </p>
                  <p className="text-lg">Name: {user.name}</p>
                  <p className="text-lg">Phone no: {user.phone}</p>

                  {product.userId === userSession?.uid ? (
                    <Link to={`/edit-item/${product._id}`}>
                      <Button className="text-md mt-3" size="lg">
                        Edit Product
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/chat/${product.userId}`}>
                      <Button className="text-md mt-3" size="lg">
                        Message Seller
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="text-4xl font-bold tracking-tight">
              Similar Products
            </p>
            <SimilarProducts category={product.category} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductInfo;
