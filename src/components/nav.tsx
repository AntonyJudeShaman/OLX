import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { MenuIcon, SearchIcon, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function MainNav() {
  const user = useAuth();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const signout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/explore?q=${searchQuery}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold">OLX</span>
        </Link>
        <div className="relative flex-1 max-w-md mx-4">
          <div className="absolute inset-y-0 left-0 flex items-center hover:bg-orange-500 pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          <form onSubmit={handleSearchSubmit}>
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-12 rounded-md bg-muted focus:ring-primary focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute inset-y-0 rounded-none right-0 rounded-r-md"
            >
              <SearchIcon className="w-5 h-5" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>
        <div className="flex items-center gap-2">
          <>
            {!user ? (
              <div className="space-x-4">
                <Link
                  to="login"
                  className="hidden px-4 py-2 text-sm font-medium rounded-md md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  Login
                </Link>
                <Link
                  to="signup"
                  className="hidden px-4 py-2 text-sm font-medium text-primary rounded-md border border-primary hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 md:inline-flex"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="md:block hidden">
                {" "}
                <div className="flex items-center space-x-6">
                  {user.userType === "seller" ? (
                    <Link to="/sell">
                      <Button className="px-8 text-md">Sell</Button>
                    </Link>
                  ) : (
                    <Link to="/explore">
                      <Button className="px-6 py-5 text-md">Explore</Button>
                    </Link>
                  )}
                  <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                      <div className="p-0">
                        <div className="flex items-center justify-center text-sm font-bold bg-gray-700 hover:border-green-500 border text-white uppercase rounded-full select-none size-10 shrink-0">
                          {user?.username?.[0].toLocaleUpperCase()}
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
                        {user?.username}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <Link to="/profile">
                        <DropdownMenuItem className="flex text-sm h-8 rounded-lg items-center cursor-pointer">
                          <User className="size-5 mr-2" />
                          Profile
                        </DropdownMenuItem>
                      </Link>
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
                </div>
              </div>
            )}
          </>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="w-6 h-6" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              {user ? (
                <>
                  {" "}
                  <div className="p-0 mt-[2rem] flex flex-col mx-auto">
                    <div className="flex items-center mx-auto justify-center text-sm font-bold bg-gray-700 hover:border-green-500 border text-white uppercase rounded-full select-none size-10 shrink-0">
                      {user?.username?.[0].toLocaleUpperCase()}
                    </div>
                    <p className="flex font-bold text-2xl tracking-tighter mx-auto mt-4">
                      {user?.username}
                    </p>
                    <div className="mt-[5rem] flex flex-col">
                      <Link to="/profile">
                        <div className="flex text-md cursor-pointer items-center mb-6 font-semibold tracking-tighter">
                          <User className="size-8 mr-2" />
                          Profile
                        </div>
                      </Link>
                      <Link to="/settings">
                        <div className="flex text-md cursor-pointer items-center mb-6 font-semibold tracking-tighter">
                          <Settings className="size-8 mr-2" />
                          Settings
                        </div>
                      </Link>
                    </div>
                    <div className="text-sm h-8 flex items-center rounded-lg cursor-pointer">
                      <Button className="w-full" onClick={() => signout()}>
                        Logout
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid space-x-4 p-4">
                  <Link
                    to="login"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    Login
                  </Link>
                  <Link
                    to="signup"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-primary border border-primary hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
