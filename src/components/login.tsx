import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "./ui/button";
import { auth } from "../lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorerrorMessage] = useState("");

  const handleSubmit = () => {
    setLoading(true);
    if (!values.email || !values.password) {
      setErrorerrorMessage("Please fill all fields");
      return;
    } else {
      setErrorerrorMessage("");
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(async () => {
          await navigate("/");
          setLoading(false);
        })
        .catch((error) => {
          setErrorerrorMessage(error.message);
          setLoading(false);
        });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-full">
      <Card className="max-w-sm md:max-w-md mt-[5rem] rounded-2xl flex flex-col justify-center mx-auto">
        <CardHeader>
          <CardTitle className="font-bold text-3xl">Login</CardTitle>
          <CardDescription className="text-md">
            Please provide credentials to login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            className="text-md"
            placeholder="Enter an email"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          <Input
            type="password"
            className="text-md"
            placeholder="Enter a password"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm flex justify-center">
              {errorMessage}
            </p>
          )}
          <p className="flex float-end hover:underline cursor-pointer">
            Forgot Password?
          </p>
        </CardContent>
        <CardFooter className="flex flex-col mx-auto">
          <Button
            onClick={handleSubmit}
            type="submit"
            className="w-full text-md"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p className="mt-5">
            Don&apos;t have an account?
            <span className="px-2 hover:underline">
              <Link to={"/Signup"}>Signup</Link>
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
