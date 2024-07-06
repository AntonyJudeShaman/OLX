import React, { FormEvent, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { deleteUser } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app, auth } from "../../lib/firebase";
import { useAuth } from "../../lib/auth";
import { User } from "lucide-react";
import MyToast from "../ui/my-toast";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface Profile {
  userId: string;
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  phone?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

export default function UserDashboard() {
  const [initialData, setInitialData] = useState<Partial<Profile>>({});
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [dataChanged, setDataChanged] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const storage = getStorage(app);
  const user = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${user?.uid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error`);
        }

        const userData = await response.json();

        setInitialData(userData);
        setFormData(userData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (user?.uid) {
      fetchProfile();
    } else {
      console.error("Error");
    }
  }, [user?.uid]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setDataChanged(true);
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const toastId = toast.loading("Uploading profile picture...");
      try {
        const storageRef = ref(storage, `profile-pictures/${user?.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
        setDataChanged(true);
        toast.success("Profile picture updated successfully", { id: toastId });
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error("Failed to upload profile picture", { id: toastId });
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const changedData: Partial<Profile> = {};
    for (const key in formData) {
      if (
        formData[key as keyof Profile] !== initialData[key as keyof Profile]
      ) {
        changedData[key as keyof Profile] = formData[key as keyof Profile];
      }
    }

    if (Object.keys(changedData).length > 0) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${user?.uid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(changedData),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        setInitialData({ ...initialData, ...changedData });
        setDataChanged(false);
        MyToast({
          message: "Profile updated successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        MyToast({
          message: "Failed to update profile",
          type: "error",
        });
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const loadingToastId = toast.loading("Deleting account...");

      const user = auth.currentUser;

      if (!user) {
        throw new Error("No user is currently logged in");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.uid}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete account from the backend");
      }

      await deleteUser(user);

      toast.dismiss(loadingToastId);
      toast.success("Account deleted successfully");

      const navigate = useNavigate();
      navigate("/");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to delete account");
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-background rounded-2xl shadow-lg overflow-hidden md:my-12">
      <header className="bg-gray-300 text-primary-foreground py-6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center text-center">
            <Avatar className="size-16">
              <AvatarImage
                className="object-cover"
                src={formData.profilePicture}
              />
              <AvatarFallback>
                <User className="text-black size-8" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col justify-start">
            <p className="font-semibold text-black text-2xl tracking-tighter">
              {formData.name}
            </p>
            <div className="text-zinc-700 tracking-tighter">
              @{formData.username}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </header>
      <div className="p-8">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="border-b">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="py-6">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative bg-gray-200 rounded-full">
                    <Avatar className="w-16 h-16 rounded-full">
                      <AvatarImage
                        className="object-cover"
                        src={formData.profilePicture}
                      />
                      <AvatarFallback className="bg-transparent">
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <Input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleProfilePictureChange}
                    />
                  </div>
                  <div>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="font-semibold"
                    />
                    <div className="text-muted-foreground">
                      @{formData.username}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    className="h-32"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Button type="submit" disabled={!dataChanged}>
                Save Changes
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="security" className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="password">Current Password</Label>
                  <Input id="password" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="p-8">
          <Tabs defaultValue="profile" className="w-full" />
          <div className="mt-8 flex justify-end">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete your account?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All your data will be permanently
                deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount}>
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
