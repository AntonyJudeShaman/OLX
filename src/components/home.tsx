import React from "react";
import { Link } from "react-router-dom";
import AllProducts from "./Product/products";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto min-h-full px-4 py-8">
        <section className="">
          <ul className="flex gap-4 justify-between w-1/2">
            <li>
              <Link
                to="/category/electronics"
                className="p-3 rounded-2xl hover:border hover:border-gray-400 hover:bg-slate-200 transition duration-300"
              >
                Electronics
              </Link>
            </li>
            <li>
              <Link
                to="/category/clothing"
                className="p-3 rounded-2xl hover:border hover:border-gray-400 hover:bg-slate-200 transition duration-300"
              >
                Clothing
              </Link>
            </li>
            <li>
              <Link
                to="/category/furniture"
                className="p-3 rounded-2xl hover:border hover:border-gray-400 hover:bg-slate-200 transition duration-300"
              >
                Furniture
              </Link>
            </li>
            <li>
              <Link
                to="/category/sports"
                className="p-3 rounded-2xl hover:border hover:border-gray-400 hover:bg-slate-200 transition duration-300"
              >
                Sports
              </Link>
            </li>
            <li>
              <Link
                to="/category/home%20appliances"
                className="p-3 rounded-2xl hover:border hover:border-gray-400 hover:bg-slate-200 transition duration-300"
              >
                Home Appliances
              </Link>
            </li>
          </ul>
        </section>
        <section>
          <AllProducts />
        </section>
      </main>
    </div>
  );
};

export default Home;
