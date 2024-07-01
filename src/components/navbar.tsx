import React, { useState } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Settings } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const Navbar: React.FC = () => {
  const user = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const signout = () => {
    signOut(auth)
      .then(() => {
        navigate("/Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <nav className="flex justify-between py-4 px-8 bg-gray-200 border-b-2 border-zinc-300">
      <div>
        {" "}
        <p className="font-extrabold text-2xl">
          <Link to="/">
            OL<span className="font-extrabold text-lg">X</span>
          </Link>
        </p>
      </div>
      <div className="space-x-6">
        {" "}
        {user ? (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <div className="p-0">
                <div className="flex items-center justify-center text-sm font-bold bg-gray-700 hover:border-green-500 border text-white uppercase rounded-full select-none size-10 shrink-0">
                  {user?.displayName?.[0].toLocaleUpperCase()}
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              sideOffset={10}
              align="start"
              className="w-[250px] lg:w-[220px] border border-gray-400 p-2 rounded-2xl mr-3"
              onMouseLeave={() => setOpen(false)}
            >
              <DropdownMenuItem className="flex text-sm h-8 rounded-lg items-center">
                {user?.displayName}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to="/settings">
                <DropdownMenuItem className="flex text-sm h-8 rounded-lg items-center cursor-pointer">
                  <Settings className="size-5 mr-2" />
                  Settings
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm h-8 flex items-center rounded-lg cursor-pointer">
                <Button className="w-full" onClick={() => signout()}>
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link to={"/Signup"}>
              <Button className="text-md">Login</Button>
            </Link>
            <Link to={"/Login"}>
              <Button className="bg-green-600 px-8 text-md">Sell</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
