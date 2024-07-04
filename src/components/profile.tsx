import YourProducts from "./Product/yourproducts";
import { useAuth } from "../lib/auth";

function UserProfile() {
  return (
    <div>
      <p className="container text-4xl mt-5 flex items-center justify-center tracking-tighter font-bold">
        Your Products
      </p>
      <YourProducts />
    </div>
  );
}

export default UserProfile;
