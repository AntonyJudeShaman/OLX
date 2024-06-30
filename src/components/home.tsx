import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = (props: any) => {
  return (
    <div>
      <h1 className="text-red-400">
        Welcome to test authentication. Please{" "}
        <Link to={"/Signup"}>
          <a>SignUp.</a>
        </Link>
      </h1>
    </div>
  );
};

export default Home;
