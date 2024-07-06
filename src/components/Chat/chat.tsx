import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { SendIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "../../lib/auth";

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

interface Item {
  _id?: string;
  userId?: string;
  title: string;
  price: number;
  images?: string[];
}

interface ChatParams {
  itemId: string;
  buyerId: string;
  sellerId: string;
  [key: string]: string | undefined;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const { itemId, buyerId, sellerId } = useParams<ChatParams>();
  const user = useAuth();
  const [item, setItem] = useState<Item>({
    title: "",
    price: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const socket: Socket = io(`${import.meta.env.VITE_API_URLL}`, {
    transports: ["websocket"],
    reconnection: true,
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/chats/${itemId}/${buyerId}/${sellerId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data: Message[] = await res.json();
        console.log("Messages fetched", data);
        setMessages(data);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchMessages();

    socket.emit("joinChat", { itemId, buyerId, sellerId });

    socket.on("receiveMessage", (newMessages: Message[]) => {
      console.log("New messages received", newMessages);
      setMessages(newMessages);
    });
  }, [itemId, buyerId, sellerId, socket]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/items/${itemId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch item");
        }
        const data = await res.json();
        setItem(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchItem();
  }, []);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      console.log("Sending message", newMessage);
      socket.emit(
        "sendMessage",
        {
          itemId,
          buyerId,
          sellerId,
          senderId: user.uid,
          message: newMessage,
        },
        () => {
          console.log("Sent", newMessage);
        }
      );
      setNewMessage("");
    }
  };
  const groupMessagesByDay = (messages: Message[]) => {
    const grouped = messages.reduce((acc, message) => {
      const date = format(parseISO(message.timestamp), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {} as Record<string, Message[]>);

    return Object.entries(grouped).map(([date, messages]) => ({
      date,
      messages,
    }));
  };

  const renderMessage = (msg: Message, user: any) => (
    <div
      key={msg.timestamp}
      className={`flex ${
        msg.senderId === user?.uid ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`flex flex-col max-w-[70%] ${
          msg.senderId === user?.uid ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`p-3 rounded-xl ${
            msg.senderId === user?.uid
              ? "bg-primary text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {msg.message}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {format(parseISO(msg.timestamp), "p")}
        </div>
      </div>
    </div>
  );

  if (loading || !user?.uid) {
    return (
      <div className="container mt-12 p-10 mx-auto">
        <p className="text-center text-xl text-green-800 font-bold">
          Loading Please wait...
        </p>
      </div>
    );
  }

  return (
    <div className="md:container w-full mx-auto py-12">
      {user ? (
        <div className="flex flex-col h-[80vh] bg-gray-100 md:rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center gap-4 bg-gray-300 p-4 border-b">
            <img
              src={item?.images?.[0]}
              alt="Product Image"
              width={48}
              height={48}
              className="rounded-md"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <p className="text-sm text-gray-600">₹{item.price}</p>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {groupMessagesByDay(messages).map(({ date, messages }) => (
              <div key={date}>
                <div className="text-center text-sm text-gray-500 my-4">
                  {format(parseISO(date), "MMMM d, yyyy")}
                </div>
                {messages.map((msg) => renderMessage(msg, user))}
              </div>
            ))}
          </div>

          <div className="border-t p-4">
            <form
              className="relative flex space-x-4"
              onSubmit={handleSendMessage}
            >
              <Textarea
                placeholder="Type your message..."
                className="flex-1 pr-16 rounded-xl"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute top-1/2 right-3 -translate-y-1/2"
              >
                <SendIcon className="w-5 h-5" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="border border-red-400 bg-red-200 rounded-2xl p-10 mx-auto">
          <p className="text-center text-xl text-red-800 font-bold">
            Please login to chat with the seller
          </p>
          <div className="flex flex-col w-1/2 mx-auto">
            <Button
              onClick={() => navigate("/login")}
              className="mt-4 mx-auto flex"
            >
              Login to your account
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              className="mt-4 mx-auto flex"
            >
              Create an account
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
