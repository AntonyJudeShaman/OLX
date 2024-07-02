import { Routes, Route } from "react-router-dom";
import SignUp from "./components/signup";
import Login from "./components/login";
import Navbar from "./components/navbar";
import Settings from "./components/settings";
import Sell from "./components/Sell/sell";
import Home from "./components/home";
import ProductInfo from "./components/Product/productInfo";
import ProductByCategory from "./components/Product/productsbycategory";
import UserProfile from "./components/profile";
import EditItem from "./components/Product/editproduct";

function App() {
  return (
    <>
      {" "}
      <div className="flex flex-col min-h-screen bg-slate-50">
        <header>
          <Navbar />
        </header>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/items/:id" element={<ProductInfo />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/category/:category" element={<ProductByCategory />} />
          <Route path="/edit-item/:itemId" element={<EditItem />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
