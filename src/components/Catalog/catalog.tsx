import { useState, useMemo, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { FilterIcon, ListOrderedIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { isNewProduct } from "../../lib/utils";
import { Badge } from "../ui/badge";

interface Product {
  _id: number;
  title: string;
  price: number;
  category: string;
  images: string[];
  createdAt: string;
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = new URLSearchParams(location.search);
      const query = queryParams.get("q") || "";

      try {
        if (query === "") {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/items`,
            {
              method: "GET",
            }
          );
          const data = await response.json();
          setProducts(data);
          return;
        }
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/items/search/item?id=${query}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [location.search]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }
    if (selectedPrice === "5000") {
      filtered = filtered.filter((product) => product.price >= 5000);
    } else if (selectedPrice) {
      const [min, max] = selectedPrice.split("-").map(Number);
      filtered = filtered.filter(
        (product) => product.price >= min && product.price <= max
      );
    }
    if (sortBy) {
      filtered = filtered.sort((a, b) => {
        if (sortBy === "priceAsc") return a.price - b.price;
        if (sortBy === "priceDesc") return b.price - a.price;
        if (sortBy === "nameAsc") return a.title.localeCompare(b.title);
        if (sortBy === "nameDesc") return b.title.localeCompare(a.title);
        return 0;
      });
    }
    return filtered;
  }, [products, selectedCategory, selectedPrice, sortBy]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl tracking-tighter font-bold">All Products</h1>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FilterIcon className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Category</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={selectedCategory === ""}
                onCheckedChange={() => setSelectedCategory("")}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedCategory === "Electronics"}
                onCheckedChange={() => setSelectedCategory("electronics")}
              >
                Electronics
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategory === "Sports"}
                onCheckedChange={() => setSelectedCategory("sports")}
              >
                Sports
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategory === "Clothing"}
                onCheckedChange={() => setSelectedCategory("clothing")}
              >
                Clothing
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategory === "Furniture"}
                onCheckedChange={() => setSelectedCategory("furniture")}
              >
                Furniture
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategory === "Home Appliances"}
                onCheckedChange={() => setSelectedCategory("Home Appliances")}
              >
                Home
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Price</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={selectedPrice === ""}
                onCheckedChange={() => setSelectedPrice("")}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedPrice === "0-500"}
                onCheckedChange={() => setSelectedPrice("0-500")}
              >
                ₹0 - ₹500
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedPrice === "500-1000"}
                onCheckedChange={() => setSelectedPrice("500-1000")}
              >
                ₹500 - ₹1000
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedPrice === "1000-2000"}
                onCheckedChange={() => setSelectedPrice("1000-2000")}
              >
                ₹1000 - ₹2000
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedPrice === "2000-5000"}
                onCheckedChange={() => setSelectedPrice("2000-5000")}
              >
                ₹2000 - ₹5000
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedPrice === "5000"}
                onCheckedChange={() => setSelectedPrice("5000")}
              >
                ₹5000+
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListOrderedIcon className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="priceAsc">
                  Price: Low to High
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="priceDesc">
                  Price: High to Low
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="nameAsc">
                  Name: A to Z
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="nameDesc">
                  Name: Z to A
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-background rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <Link to={`/items/${product._id}`} className="block">
              <img
                src={product.images[0]}
                alt={product.title}
                width={400}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <p className="flex justify-end">
                  {isNewProduct(product.createdAt) && (
                    <Badge className="mt-2 text-sm font-semibold">New</Badge>
                  )}
                </p>
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-muted-foreground">
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)}
                </p>
                <p className="text-primary font-semibold">₹{product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
