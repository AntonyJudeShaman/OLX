import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { auth } from "../../lib/firebase";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
  const userSession = auth.currentUser;
  const [item, setItem] = useState<Item>({
    title: "",
    price: 0,
  });

  const navigate = useNavigate();

  const socket: Socket = io(`${import.meta.env.VITE_API_URLL}`, {
    transports: ["websocket", "polling"],
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
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.emit("joinChat", { itemId, buyerId, sellerId });

    socket.on("receiveMessage", (newMessages: Message[]) => {
      console.log("New messages received", newMessages);
      setMessages(newMessages);
    });

    return () => {
      socket.disconnect();
    };
  }, [itemId, buyerId, sellerId, socket]);

  useEffect(() => {
    const fetchitem = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/items/${itemId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch item");
        }
        const data = await res.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchitem();
  }, []);

  const handleSendMessage = async () => {
    if (userSession) {
      console.log("Sending message", newMessage);
      socket.emit(
        "sendMessage",
        {
          itemId,
          buyerId,
          sellerId,
          senderId: userSession.uid,
          message: newMessage,
        },
        () => {
          console.log("Sent", newMessage);
        }
      );
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto py-12">
      {userSession ? (
        <>
          <h1 className="text-5xl mb-2 font-bold tracking-tighter">
            Chat for {item.title}
          </h1>
          <p className="text-xl mb-8 font-bold tracking-tighter">
            Price:
            <span className="font-normal tracking-loose"> {item.price}</span>
          </p>
          <div className="flex flex-col space-y-4">
            {messages.length > 0 &&
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message p-4 rounded-3xl ${
                    msg.senderId === userSession?.uid
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-gray-700 self-start"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
          </div>
          <div className="flex flex-row items-center mt-4">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-2 rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <Button
              className="ml-4 px-6 h-10 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </div>
        </>
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
            </Button>{" "}
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
