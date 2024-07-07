import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Heart,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Link, useParams } from "react-router-dom";
import { useAuth, User } from "../../lib/auth";
import SimilarProducts from "./similarproducts";
import { isNewProduct } from "../../lib/utils";
import MyToast from "../ui/my-toast";

export interface Product {
  _id?: string;
  userId?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  createdAt: string;
}

export default function ProductInfo() {
  const [product, setProduct] = useState<Product>({
    title: "",
    description: "",
    price: 0,
    category: "",
    images: [],
    createdAt: "",
  });
  const [user, setUser] = useState<User>({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);

  let { id } = useParams<{ id: string }>();

  const userSession = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/items/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }
        const data: Product = await res.json();
        setProduct(data);
        setLoading(false);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        setLoading(false);
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

  const addToWishlist = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/wishlist/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userSession?.uid,
            itemId: product._id,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to add to wishlist");
      }

      const updatedUser = await res.json();
      MyToast({ message: "Added to wishlist", type: "success" });
      setIsWishlist(true);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  if (loading && !user?.uid) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {product && (
        <section className="w-full py-12 md:py-24 lg:py-32 z-40">
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-6">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="rounded-lg overflow-hidden group"
            >
              <CarouselContent>
                {product.images.map((image) => (
                  <CarouselItem>
                    <img
                      src={image}
                      alt="Product Image"
                      width={600}
                      height={600}
                      className="w-full h-[400px] md:h-[600px] object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute opacity-0 group-hover:opacity-100 top-1/2 left-4 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/75 rounded-full p-2 transition-colors">
                <ChevronLeftIcon className="w-6 h-6 text-foreground" />
              </CarouselPrevious>
              <CarouselNext className="absolute opacity-0 group-hover:opacity-100 top-1/2 right-4 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/75 rounded-full p-2 transition-colors">
                <ChevronRightIcon className="w-6 h-6 text-foreground" />
              </CarouselNext>
            </Carousel>
            <div className="space-y-8 flex flex-col justify-evenly h-full">
              <div className="flex items-center gap-2">
                <Link to={`/category/${product.category}`}>
                  <Badge
                    variant="outline"
                    className="text-md bg-black text-white"
                  >
                    {product.category.charAt(0).toUpperCase() +
                      product.category.slice(1)}
                  </Badge>
                </Link>
              </div>
              <>
                <h1 className="text-3xl items-start flex sm:text-5xl font-bold tracking-tight">
                  <p className="flex justify-start items-center">
                    {product.title}
                    {isNewProduct(product.createdAt) && (
                      <Badge className="mt-2 ml-3 text-sm font-semibold">
                        New
                      </Badge>
                    )}
                  </p>
                </h1>
                <p className="text-muted-foreground flex items-start text-lg">
                  {product.description}
                </p>
              </>
              <div className="flex items-center justify-between gap-4">
                <span className="text-4xl font-bold">₹{product.price}</span>
                {userSession?.wishlistItems?.includes(product?._id!) ||
                isWishlist ? (
                  <Button className="flex space-x-3" size="lg" disabled>
                    <Heart />
                    <span>Already Added</span>
                  </Button>
                ) : (
                  <Button
                    className="flex space-x-3"
                    size="lg"
                    onClick={addToWishlist}
                  >
                    <Heart />
                    <span>Add to wishlist</span>
                  </Button>
                )}
              </div>
              <div className="flex md:flex-row flex-col md:items-center justify-between gap-4">
                <div className="grid gap-1">
                  <h3 className="font-semibold">Sold by:</h3>
                  <Link to={`/users/${product.userId}`}>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-10 border">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback
                          className={
                            user.profilePicture ? "" : "bg-gray-700 text-white"
                          }
                        >
                          {user.profilePicture
                            ? user.profilePicture
                            : user?.username?.[0].toLocaleUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.phone}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                <Link
                  to={`/chat/${product._id}/${userSession?.uid}/${product.userId}`}
                  className="z-30"
                >
                  {product.userId !== userSession?.uid ? (
                    <Link
                      to={`/chat/${product._id}/${userSession?.uid}/${product.userId}`}
                      className="z-30"
                    >
                      <Button
                        size="lg"
                        className="text-sm md:text-md items-center flex"
                      >
                        Message Seller
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/edit-item/${product._id}`} className="z-30">
                      <Button
                        size="lg"
                        className="text-sm md:text-md items-center flex"
                      >
                        Edit Product
                      </Button>
                    </Link>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="container">
        <p className="text-4xl font-bold tracking-tight">Similar Products</p>
        <SimilarProducts category={product.category} />
      </div>
    </div>
  );
}
