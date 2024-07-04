import { useEffect, useState } from "react";
import { User } from "../../lib/auth";
import MyToast from "../ui/my-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function Banner() {
  const [admin, setAdmin] = useState<User | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminRes = await fetch(
          `http://localhost:10000/api/users/PNfwuvaBe0c28FJQmnPyrRX4Ao43`
        );
        if (!adminRes.ok) {
          throw new Error("Failed to fetch user details2");
        }
        const adm = await adminRes.json();
        setAdmin(adm);
      } catch (error) {
        MyToast({ message: "Error fetching user details", type: "error" });
      }
    };

    fetchAdmin();
  }, []);

  return (
    <>
      {admin && admin.banners?.length && (
        <div className="mx-auto container py-12">
          <Carousel
            className="w-full h-30 max-h-1/4 group"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="max-h-1/4">
              {admin.banners.map((banner, index) => (
                <CarouselItem key={index}>
                  <img
                    src={banner}
                    alt={`Banner ${index}`}
                    className="object-cover w-full h-[300px] md:h-[500px] rounded-3xl md:rounded-[45px]"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute opacity-0 group-hover:opacity-100 top-1/2 left-4 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/75 rounded-full p-2 transition-colors">
              <ChevronLeftIcon className="w-6 h-6 text-foreground" />
            </CarouselPrevious>
            <CarouselNext className="absolute opacity-0 group-hover:opacity-100 top-1/2 right-4 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/75 rounded-full p-2 transition-colors">
              <ChevronRightIcon className="w-6 h-6 text-foreground" />
            </CarouselNext>
          </Carousel>
        </div>
      )}
    </>
  );
}
