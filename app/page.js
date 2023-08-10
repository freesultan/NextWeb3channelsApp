"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ChannelContractABI from "@/artifacts/contracts/ChannelsContract.sol/ChannelsContract.json";
import config from "@/config.json";

import Navigation from "./components/Navigation";
import Channels from "./components/Channels";
import Messages from "./components/Messages";

import { io } from "socket.io-client";

const socket = io("ws://localhost:3030");

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [channelContract, setChannelContract] = useState(null);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messages, setMessages] = useState([]);

  const loadBlockchain = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    console.log("network: " + network.chainId);

    const channelContract = new ethers.Contract(
      config[network.chainId].ChannelsContract.address,
      ChannelContractABI.abi,
      provider
    );

    setChannelContract(channelContract);
    console.log("channelContract", channelContract);

    const totalChannels = await channelContract.totalChannels();
    console.log("totalChannels", totalChannels.toString());
    const channels = [];

    for (var i = 1; i <= totalChannels; i++) {
      const channel = await channelContract.getChannel(i);
      channels.push(channel);
    }
    setChannels(channels);
    console.log("Channels> " + channels);

    //reload page after changing account
    window.ethereum.on("accountsChanged", async () => {
      window.location.reload();
    });
  };
  useEffect(() => {
    loadBlockchain();

    //socket

    socket.on("connect", () => {
      socket.emit("get messages");
    });

    socket.on("new message", (messages) => {
      console.log("new messages sent from server");
      setMessages(messages);
    });

    socket.on("get messages", (messages) => {
      console.log("client get messages");
      setMessages(messages);
    });

    return () => {
      socket.off("connect");
      socket.off("new message");
      socket.off("get messages");
    };
  }, []);

  return (
    <div className="container mx-auto">
      <Navigation account={account} setAccount={setAccount} />

      <main className="bg-slate-400 min-h-screen flex flex-row flex-wrap ">
        <Channels
          provider={provider}
          account={account}
          channelContract={channelContract}
          channels={channels}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
        />

        <Messages
          account={account}
          messages={messages}
          currentChannel={currentChannel}
        />
      </main>
    </div>
  );
}
