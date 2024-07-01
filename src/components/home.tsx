import React from "react";
import { Link } from "react-router-dom";

const Home = (props: any) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to OLX</h1>
          <p className="text-gray-600">Buy and Sell Anything Online!</p>
        </div>
      </header>

      <main className="container mx-auto min-h-full px-4 py-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Featured Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example of a featured item */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                Item Title
              </h3>
              <p className="text-gray-600 mt-2">Description of the item.</p>
              <Link to="/item/1" className="text-blue-500 mt-4 inline-block">
                View Details
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
          <ul className="grid grid-cols-2 gap-4">
            <li>
              <Link
                to="/items/electronics"
                className="bg-white block p-4 rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
              >
                Electronics
              </Link>
            </li>
            <li>
              <Link
                to="/items/clothing"
                className="bg-white block p-4 rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
              >
                Clothing
              </Link>
            </li>
            <li>
              <Link
                to="/items/furniture"
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
                Sports & Outdoors
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
