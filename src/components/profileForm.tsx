import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useAuth } from "../lib/auth";
import MyToast from "./ui/my-toast";

interface Profile {
  userId: string;
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

const ProfileForm = () => {
  const [initialData, setInitialData] = useState<Partial<Profile>>({});
  const [formData, setFormData] = useState<Partial<Profile>>({});

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
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        console.log("Fetched user data:", userData);

        setInitialData(userData);
        setFormData(userData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (user?.uid) {
      fetchProfile();
    } else {
      console.error("User ID is not available.");
    }
  }, [user?.uid]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    console.log("Changed data:", changedData);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user?.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changedData), // Assuming changedData is your updated user data
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      MyToast({
        message: "Profile updated successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-full flex flex-col mx-auto">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm md:max-w-md rounded-2xl border mt-[5rem] mx-auto justify-center w-full border-gray-400/80 p-6"
      >
        <div>
          <Label>
            Name:
            <Input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </Label>
        </div>
        <div>
          <Label>
            Location:
            <Input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
            />
          </Label>
        </div>
        <div>
          <Label>
            Bio:
            <Textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
            />
          </Label>
        </div>
        <div>
          <Label>
            Phone Number:
            <Input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </Label>
        </div>
        <Button type="submit" className="mt-4 flex float-end">
          Update
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
