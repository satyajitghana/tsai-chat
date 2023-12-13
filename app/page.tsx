import Header from "@/components/Header";
import Messages from "@/components/Messages";
import SystemMessage from "@/components/SystemMessage";
import ChatProvider from "@/context/ChatProvider";
import axios from "axios";
import Image from "next/image";

export default async function Home() {

  return (
    <ChatProvider>
      <main className="max-w-screen relative flex max-h-screen w-screen flex-col">
        <Header />
        <div className="flex h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] grow flex-row">
          <div className="flex grow flex-col items-stretch md:flex-row">
            <div className="flex grow">
              <SystemMessage />
            </div>
            <div className="flex grow basis-7/12 overflow-hidden">
              <Messages />
            </div>
          </div>
        </div>
      </main>
    </ChatProvider>
  );
}
