import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null); // auto-scroll anchor

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on("receive-message", (message) => {
      // listens for any incoming msgs from server
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          from: "other",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]);
    });

    newSocket.on("file-uploaded", ({ fileUrl, fileName }) => {
      // listens for any incoming file from server
      setMessages((prev) => [
        ...prev,
        {
          file: fileUrl,
          text: fileName, // fileUrl and fileName are sent by the backend
          from: "other",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleFileSend = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("socketId", socket.id); // send your socket id

    try {
      const response = await fetch("http://localhost:3000/profile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); // { fileUrl }

      setMessages((prev) => [
        ...prev,
        {
          file: data.fileUrl,
          text: file.name,  // local filename
          from: "me",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error("File upload failed", error);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("send-message", input); // send message to server
    setMessages((prev) => [
      ...prev,
      {
        text: input,
        from: "me",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      },
    ]); // displays on frontend
    setInput("");
  };

  useEffect(() => {
    console.log(messages);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" }); // auto-scroll
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow px-6 py-4">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400">
          💬 Chat App
        </h1>
      </header>

      <main className="flex-1 p-4 space-y-4 overflow-y-auto h-screen">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.from === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] sm:max-w-[70%] md:max-w-[60%] text-sm sm:text-base ${
                msg.from === "me"
                  ? "bg-blue-500 rounded-br-none"
                  : "bg-gray-700 rounded-bl-none"
              }`}
            >
              {msg.text}

              {msg.file &&
                (msg.file.match(/\.(jpeg|jpg|png)$/i) ? (
                  <img
                    src={msg.file}
                    alt="sent file"
                    className="mt-2 max-h-64 rounded-lg"
                  />
                ) : (
                  <a
                    href={msg.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-200 underline break-all"
                  >
                    Download file
                  </a>
                ))}

              <div className="text-xs text-gray-300 mt-2 text-right">
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      <footer className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message"
            className="flex-1 px-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`px-4 py-2 rounded-full transition ${
              input.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            Send
          </button>

          <label className="relative cursor-pointer px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition">
            Send File
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleFileSend(e.target.files[0])}
            />
          </label>
        </div>
      </footer>
    </div>
  );
}

export default App;
