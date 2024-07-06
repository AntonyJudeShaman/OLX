import {
  CpuIcon,
  FootprintsIcon,
  HomeIcon,
  ShirtIcon,
  ShoppingBagIcon,
  WatchIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CategoryNav() {
  return (
    <section className="w-full container bg-blue-300/20 flex items-center border border-gray-300 rounded-[35px] p-8">
      <div className="gap-6 w-full flex items-center justify-center">
        <div className="grid md:container grid-cols-3 md:grid-cols-6 items-center justify-between mx-auto gap-6 md:gap-8">
          <Link
            to={"/category/clothing"}
            className="flex flex-col items-center gap-2 text-center transition-colors hover:text-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShirtIcon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Clothing</span>
          </Link>
          <Link
            to={"/category/sports"}
            className="flex flex-col items-center gap-2 text-center transition-colors hover:text-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FootprintsIcon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Sports</span>
          </Link>
          <Link
            to={"/category/home%20appliances"}
            className="flex flex-col items-center gap-2 text-center transition-colors hover:text-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingBagIcon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Home Appliances</span>
          </Link>
          <Link
            to={"/category/accessories"}
            className="flex flex-col items-center gap-2 text-center transition-colors hover:text-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <WatchIcon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Accessories</span>
          </Link>
          <Link
            to={"/category/electronics"}
            className="flex flex-col items-center gap-2 text-center transition-colors hover:text-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CpuIcon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Electronics</span>
          </Link>
          <Link
            to={"/category/furniture"}
            className="flex flex-col items-center gap-2 text-center transition-colors hover:text-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HomeIcon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Furniture</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
