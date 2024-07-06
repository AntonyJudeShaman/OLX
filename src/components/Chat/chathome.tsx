import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { format, parseISO } from "date-fns";
import { useAuth } from "../../lib/auth";

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

interface Chat {
  _id: string;
  sellerId: string;
  buyerId: string;
  itemId: string;
  itemName?: string;
  messages: Message[];
}

export default function ChatHome() {
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [loading, setLoading] = useState(true);
  const userSession = useAuth();

  const memoizedChats = useMemo(() => chats, [chats]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/chats/user/${userSession?.uid}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch chats");
        }
        const data: Chat[] = await res.json();

        if (data.length === 0) {
          setChats([]);
          setLoading(false);
          return;
        }

        const itemIds = Array.from(new Set(data.map((chat) => chat.itemId)));

        const itemFetchPromises = itemIds.map(async (itemId) => {
          const itemRes = await fetch(
            `${import.meta.env.VITE_API_URL}/items/${itemId}`
          );
          if (!itemRes.ok) {
            throw new Error(`Failed to fetch item with id ${itemId}`);
          }
          const itemData = await itemRes.json();
          return { itemId, itemName: itemData.title };
        });

        const itemNames = await Promise.all(itemFetchPromises);

        data.forEach((chat) => {
          const foundItem = itemNames.find(
            (item) => item.itemId === chat.itemId
          );
          if (foundItem) {
            chat.itemName = foundItem.itemName;
          }
        });

        data.sort((a, b) => {
          const lastMessageA = a.messages[a.messages.length - 1]?.timestamp;
          const lastMessageB = b.messages[b.messages.length - 1]?.timestamp;
          if (!lastMessageA || !lastMessageB) return 0;
          return (
            new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime()
          );
        });

        setChats(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userSession?.uid]);

  if (loading || !userSession?.uid) {
    return (
      <div className="flex justify-center items-center text-xl w-full mx-auto py-12">
        Loading...
      </div>
    );
  }

  if (!userSession) {
    return (
      <div className="border border-red-400 bg-red-200 rounded-2xl p-10 mx-auto">
        <p className="text-center text-xl text-red-800 font-bold">
          Please login to see your chat history
        </p>
        <div className="flex flex-col w-1/2 mx-auto">
          <Button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 mx-auto flex"
          >
            Login to your account
          </Button>
          <Button
            onClick={() => (window.location.href = "/signup")}
            className="mt-4 mx-auto flex"
          >
            Create an account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:container w-full mx-auto py-12">
      <div className="flex flex-col h-[80vh] bg-gray-100 md:rounded-2xl shadow-lg overflow-auto">
        <header className="bg-gray-300 py-4 px-6">
          <h1 className="text-2xl font-bold">Chat History</h1>
        </header>
        <div className="flex-1 overflow-y-auto">
          {memoizedChats && memoizedChats.length > 0 ? (
            <ul className="divide-y divide-muted">
              {memoizedChats.map((chat) => (
                <li
                  key={chat._id}
                  className=" hover:bg-muted/50 transition-colors"
                >
                  <Link
                    to={`/chat/${chat.itemId}/${chat.buyerId}/${chat.sellerId}`}
                    className="flex items-center gap-4 hover:text-primary hover:bg-gray-300/40 p-4 duration-200"
                  >
                    <div className="flex-1">
                      <h2 className="text-xl tracking-tighter font-semibold">
                        {chat.itemName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {chat.messages[chat.messages.length - 1]?.message}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(
                        parseISO(
                          chat.messages[chat.messages.length - 1]?.timestamp
                        ),
                        "MMMM d, p"
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 mt-4">No chats found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
