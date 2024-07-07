import { PlusIcon } from "lucide-react";
import YourProducts from "./Product/yourproducts";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

function UserProducts() {
  return (
    <div>
      <div className="flex md:flex-row flex-col items-center pt-8 justify-between container">
        <p className="text-4xl mt-5 flex tracking-tighter font-bold">
          Your Products
        </p>
        <Link to="/sell" className="mt-5">
          <Button className="flex space-x-2" size="lg">
            <PlusIcon /> <span className="inline-block">Add product</span>
          </Button>
        </Link>
      </div>
      <YourProducts />
    </div>
  );
}

export default UserProducts;
