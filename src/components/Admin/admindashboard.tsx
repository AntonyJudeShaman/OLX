import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Pencil, PlusIcon, SearchIcon } from "lucide-react";
import { redirect } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { User, useAuth } from "../../lib/auth";
import MyToast from "../ui/my-toast";
import { debounce } from "../../lib/utils";
import { Input } from "../ui/input";
import CreateBanner from "../Banner/createbanner";

export default function AdminDashboard() {
  const user = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResponse, setSearchResponse] = useState<string>("");
  const [admin, setAdmin] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:10000/api/users`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const res = await response.json();
        setUsers(res);
      } catch (error) {
        MyToast({ message: "Error fetching user details", type: "error" });
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminRes = await fetch(
          `http://localhost:10000/api/users/${user?.id}`
        );
        if (!adminRes.ok) {
          throw new Error("Failed to fetch user details2");
        }
        const adm = await adminRes.json();
        setAdmin(adm);
      } catch (error) {
        // MyToast({ message: "Error fetching user details", type: "error" });
      }
    };

    fetchAdmin();
  }, [user?.id]);

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:10000/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers(users.filter((user) => user.id !== userId));
      MyToast({ message: "User deleted successfully", type: "success" });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const response = await fetch(
        `http://localhost:10000/api/users/search/user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: query }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const res = await response.json();
      setUsers(res);
      setSearchResponse(`${res.length} Results found`);
    } catch (error) {
      setSearchResponse("No results found");
      console.error("Error fetching search results:", error);
    }
  };

  const debouncedSearch = useCallback(debounce(searchUsers, 300), []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  if (user?.userType !== "admin") {
    redirect("/");
  }

  console.log("Admin:", admin?.banners);

  return (
    <>
      {user && user.userType === "admin" && (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_fr]">
          <div className="flex flex-col md:container">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
              <Tabs defaultValue="users">
                <TabsList>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="banners">Banners</TabsTrigger>
                </TabsList>
                <TabsContent value="users">
                  <Card className="md:container">
                    <CardHeader className="px-7">
                      <CardTitle className="text-4xl font-bold tracking-tighter">
                        Users
                      </CardTitle>
                      <CardDescription>
                        Manage your users and their roles.
                      </CardDescription>{" "}
                      <div className="relative">
                        <SearchIcon className="absolute left-2.5 top-3 size-4 text-muted-foreground" />
                        <Input
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          placeholder="Search users by ID, name, username, email and user-type"
                          className="w-full bg-background shadow-none appearance-none pl-8 "
                        />
                      </div>
                      <p className="text-red-500 text-sm font-semibold">
                        {searchResponse}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users?.map((user) => (
                            <TableRow key={`${user.id}-${user.username}`}>
                              <TableCell className="font-medium">
                                {user?.username}
                              </TableCell>
                              <TableCell>{user?.email}</TableCell>
                              <TableCell>{user?.userType}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                    >
                                      <Pencil className="h-4 w-4" />
                                      <span className="sr-only">
                                        Toggle menu
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      className="text-red-500"
                                      onClick={() =>
                                        handleDeleteUser(user.id as string)
                                      }
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="banners">
                  <Card>
                    <CardHeader className="">
                      <div className="flex">
                        <div className="flex flex-col md:container">
                          <CardTitle className="text-4xl font-bold tracking-tighter">
                            Banners
                          </CardTitle>
                          <CardDescription className="text-md">
                            Manage your banner images.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CreateBanner
                        initialBanners={admin?.banners || []}
                        bannerLimit={5}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
