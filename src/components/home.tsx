import React from "react";
import { Link } from "react-router-dom";
import AllProducts from "./Product/products";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto min-h-full px-4 py-8">
        <section>
          <AllProducts />
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
          <ul className="grid grid-cols-2 gap-4">
            <li>
              <Link
                to="/category/electronics"
                className="bg-white block p-4 rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
              >
                Electronics
              </Link>
            </li>
            <li>
              <Link
                to="/category/clothing"
                className="bg-white block p-4 rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
              >
                Clothing
              </Link>
            </li>
            <li>
              <Link
                to="/category/furniture"
                className="bg-white block p-4 rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
              >
                Furniture
              </Link>
            </li>
            <li>
              <Link
                to="/category/sports"
                className="bg-white block p-4 rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
              >
                Sports
              </Link>
            </li>
            <li>
              <Link
                to="/category/home-appliances"
                className="bg-white block p-4 rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
              >
                Home Appliances
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Home;
