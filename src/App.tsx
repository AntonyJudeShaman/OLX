import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { auth } from "./lib/firebase";
import SignUp from "./components/signup";
import Login from "./components/login";
import Home from "./components/home";
import Navbar from "./components/navbar";

function App() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || "");
      } else {
        setUserName("");
      }
    });
  }, []);

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
          <Route path="/" element={<Home name={userName} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
