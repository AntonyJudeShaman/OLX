import { Routes, Route } from "react-router-dom";
import SignUp from "./components/signup";
import Login from "./components/login";
import Settings from "./components/settings";
import Sell from "./components/Sell/sell";
import Home from "./components/home";
import ProductInfo from "./components/Product/productInfo";
import ProductByCategory from "./components/Product/productsbycategory";
import EditItem from "./components/Product/editproduct";
import Chat from "./components/Chat/chat";
import MainNav from "./components/nav";
import AdminDashboard from "./components/Admin/admindashboard";
import ProductCatalog from "./components/Catalog/catalog";
import ChatHome from "./components/Chat/chathome";
import UserProducts from "./components/profile";
import UserProfile from "./components/User/user-profile";

function App() {
  return (
    <>
      {" "}
      <div className="flex flex-col min-h-screen bg-slate-50">
        <header>
          <MainNav />
        </header>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/items/:id" element={<ProductInfo />} />
          <Route path="/users/:userId" element={<UserProfile />} />
          <Route path="/profile" element={<UserProducts />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/category/:category" element={<ProductByCategory />} />
          <Route path="/explore" element={<ProductCatalog />} />
          <Route path="/edit-item/:itemId" element={<EditItem />} />
          <Route path="/chat" element={<ChatHome />} />
          <Route path="/chat/:itemId/:buyerId/:sellerId" element={<Chat />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
