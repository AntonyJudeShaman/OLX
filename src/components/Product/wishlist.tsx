import { useState, useEffect } from "react";
import { HeartIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Product } from "./productInfo";
import { useAuth } from "../../lib/auth";
import { Link } from "react-router-dom";

interface WishlistItem extends Product {
  _id: string;
}

export default function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState<WishlistItem[]>([]);
  const userSession = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userSession?.uid) {
        setLoading(false);
        return;
      }

      try {
        const userRes = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${userSession.uid}`
        );
        if (!userRes.ok) {
          throw new Error("Failed to fetch wishlist");
        }
        const userData = await userRes.json();
        const wishlistItemIds = userData.wishlistItems;

        const itemDetailsPromises = wishlistItemIds.map((itemId: string) =>
          fetch(`${import.meta.env.VITE_API_URL}/items/${itemId}`).then((res) =>
            res.json()
          )
        );
        const itemDetails = await Promise.all(itemDetailsPromises);

        setWishlistProducts(itemDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userSession?.uid]);

  const removeFromWishlist = async (productId: string) => {
    if (!userSession?.uid) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${
          userSession.uid
        }/wishlist/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to remove item from wishlist");
      }

      setWishlistProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  if (loading || !userSession?.uid) {
    return (
      <div className="container mt-12 p-10 mx-auto">
        <p className="text-center text-xl text-green-800 font-bold">
          Loading Please wait...
        </p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 md:px-6 w-full container mx-auto">
      <div className="grid gap-8">
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">
            These are the products you've added to your wishlist.
          </p>
        </div>
        {wishlistProducts.length === 0 ? (
          <p className="text-center text-lg">Your wishlist is empty.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <Link to={`/items/${product._id}`}>
                {" "}
                <div
                  key={product._id}
                  className="bg-background rounded-lg overflow-hidden shadow-sm group"
                >
                  <div className="relative">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-60 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Remove from Wishlist"
                      className="absolute top-4 right-4 bg-transparent"
                      onClick={() => removeFromWishlist(product._id)}
                    >
                      <HeartIcon className="w-5 h-5 text-red-500 fill-pink-500" />
                      <span className="sr-only">Remove from Wishlist</span>
                    </Button>
                  </div>
                  <div className="p-4 grid gap-2">
                    <h3 className="font-semibold text-xl tracking-tighter">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ₹{product.price}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => removeFromWishlist(product._id)}
                    >
                      Remove from Wishlist
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
