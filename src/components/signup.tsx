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
import { cn } from "../lib/utils";
import { useAuth } from "../lib/auth";

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
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!values.email || !values.password || !values.name) {
      setErrorMessage("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const user = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const newUserResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/users`,
        {
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
        }
      );

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
      // setLoading(false);
    } catch (error: any) {
      setErrorMessage(error.message);
      setLoading(false);
      MyToast({ message: "Cannot create an account", type: "error" });
    } finally {
    }
  };

  const user = useAuth();
  console.log(user);
  if (user?.uid) setIsLogin(true);

  if (isLogin) {
    navigate("/");
  }

  return (
    <>
      {!isLogin && (
        <div className="min-h-full">
          <Card className="max-w-sm md:max-w-md mt-[5rem] rounded-2xl flex flex-col justify-center mx-auto">
            <CardHeader>
              <CardTitle className="font-bold text-3xl">Signup</CardTitle>
              <CardDescription className="text-md">
                Please provide credentials for signup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                className="bg-popover text-popover-foreground shadow-md"
                type="text"
                placeholder="Enter a username"
                onChange={(e) =>
                  setValues({ ...values, username: e.target.value })
                }
              />
              <Input
                className="bg-popover text-popover-foreground shadow-md"
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
              <Input
                className="bg-popover text-popover-foreground shadow-md"
                type="email"
                placeholder="Enter an email"
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
              />
              <Input
                className="bg-popover text-popover-foreground shadow-md"
                type="password"
                placeholder="Enter a password"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
              <select
                className={cn(
                  "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
                  "py-1.5 pl-8 pr-2 text-sm bg-popover text-popover-foreground shadow-md",
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 "
                )}
                value={values.userType}
                onChange={(e) =>
                  setValues({ ...values, userType: e.target.value })
                }
              >
                <option className="font-semibold" disabled value="">
                  Select an option
                </option>
                <option value="buyer">I am here to buy products</option>
                <option value="seller">I am here to sell products</option>
              </select>

              {errorMessage && (
                <p className="text-red-500 font-semibold text-sm flex justify-center">
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
      )}
    </>
  );
};

export default SignUp;
