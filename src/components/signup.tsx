import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import MyToast from "./ui/my-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const SignUp = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    userType: "buyer",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!values.email || !values.password || !values.name) {
      setErrorMessage("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const newUserResponse = await fetch("http://localhost:10000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.user.uid,
          username: values.username,
          name: values.name,
          email: values.email,
          password: values.password,
          userType: values.userType,
        }),
      });

      if (!newUserResponse.ok) {
        const user = auth.currentUser;
        user?.delete().then(() => {
          MyToast({ message: "Cannot create an account", type: "error" });
        });
      } else {
        await updateProfile(user.user, {
          displayName: values.name,
        });

        MyToast({ message: "User created successfully", type: "success" });
        navigate("/");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      MyToast({ message: "Cannot create an account", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      <Card className="max-w-sm md:max-w-md mt-[5rem] rounded-2xl flex flex-col justify-center mx-auto">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            Please provide credentials for signup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Enter a username"
            onChange={(e) => setValues({ ...values, username: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Enter an email"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Enter a password"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          <Select
            onValueChange={(e: any) =>
              setValues({ ...values, userType: e.target.value })
            }
            defaultValue="buyer"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>User Type</SelectLabel>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errorMessage && (
            <p className="text-red-500 text-sm flex justify-center">
              {errorMessage}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col mx-auto">
          <Button onClick={handleSubmit} type="submit" className="w-full">
            {loading ? "Signing up..." : "Signup"}
          </Button>
          <p className="mt-2">
            Already have an account?
            <span className="px-2 hover:underline">
              <Link to={"/Login"}>Login</Link>
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
