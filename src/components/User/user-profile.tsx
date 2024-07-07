import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User, Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

interface Profile {
  userId: string;
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  phone?: string;
  email?: string;
  profilePicture?: string;
  createdAt: string;
}

export default function UserProfile() {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log(`Fetching user profile for userId: ${userId}`);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        setProfileData(userData);
      } catch (error) {}
    };

    fetchProfile();
  }, [userId]);

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-background rounded-2xl shadow-lg overflow-hidden md:my-12">
      <header className="bg-gray-300 text-primary-foreground py-6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage
              className="object-cover"
              src={profileData.profilePicture}
            />
            <AvatarFallback>
              <User className="text-black size-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-start">
            <h1 className="font-semibold text-black text-2xl tracking-tighter">
              {profileData.name}
            </h1>
            <div className="text-zinc-700 tracking-tighter">
              @{profileData.username}
            </div>
          </div>
        </div>
        <div className="text-black">
          Joined on {format(parseISO(profileData.createdAt), "MMMM d, yyyy")}
        </div>
      </header>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl tracking-tighter font-semibold">Bio</h2>
              <p className="text-muted-foreground">
                {profileData.bio || "No bio provided"}
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl tracking-tighter font-semibold">
                Contact Information
              </h2>
              <Link className="" to={`mailto:${profileData.email}`}>
                {" "}
                <div className="flex pt-2 items-center space-x-4">
                  <Mail className="text-muted-foreground" />
                  <span>{profileData.email}</span>
                </div>
              </Link>

              <Link className="" to={`tel:${profileData.phone}`}>
                <div className="flex items-center mt-3 space-x-4">
                  <Phone className="text-muted-foreground" />
                  <span>{profileData.phone || "No phone number provided"}</span>
                </div>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl tracking-tighter font-semibold">
                Location
              </h2>
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground" />
                <span>{profileData.location || "No location provided"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
