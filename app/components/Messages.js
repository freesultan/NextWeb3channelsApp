import { useEffect, useRef, useState } from "react";

import { io } from "socket.io-client";
const socket = io("ws://localhost:3030");

const Messages = ({ account, messages, currentChannel }) => {
  const [message, setMessage] = useState("");

  const messageEndRef = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("submitHandler clicked");

    const msgObj = {
      channel: currentChannel.id.toString(),
      account: account,
      text: message,
    };

    if (message !== "") {
      socket.emit("new message", msgObj);
      console.log("set to server> " + message);
    }

    setMessage("");
  };

  const scrollHandler = () => {
    setTimeout(() => {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };
  useEffect(() => {
    scrollHandler();
  }, []);
  return (
    <div className="w-full bg-gradient-to-br px-6 py-4 from-slate-500 to-slate-900  border sm:w-3/4 md:w-5/6">
      <div className="bg-slate-300 rounded p-2 min-h-screen">
        {currentChannel &&
          messages
            .filter(
              (message) => message.channel === currentChannel.id.toString()
            )
            .map((message, index) => (
              <div className="message" key={index}>
                <div className="rounded-full px-2 w-20 h-10 text-center flex items-center justify-around bg-green-700 text-yellow-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                <span>{message.account.slice(38, 42)}</span>
                  
                </div>
                <div className="mb-4 ">
                  
                  <span className="mx-16 px-2  py-2 rounded-tl-none border border-green-800 rounded-xl bg-slate-400">{message.text}</span>
                </div>
              </div>
            ))}

        <div ref={messageEndRef} />
      </div>
      <form onSubmit={submitHandler} className="flex py-2">
        {currentChannel ? (
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className=" w-full px-3 py-1 rounded"
            placeholder={`message ${currentChannel.name} channel`}
          />
        ) : (
          <input
            type="text"
            value=""
            className="w-full bg-slate-600 px-3 py-1 rounded"
            placeholder="please connect/join..."
            disable="true"
            onChange={() => {}}
          />
        )}

        <button
          type="submit"
          className="bg-blue-500 ml-2 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded "
        >
          send
        </button>
      </form>
    </div>
  );
};

export default Messages;
