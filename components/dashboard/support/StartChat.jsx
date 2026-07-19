"use client";

import { MyContext } from "@/context/MyProvider";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

const StartChat = () => {
  const { currentUser } = useContext(MyContext);

  const roomId = `room_${currentUser?.user?._id}`;

  return (
    <section className="h-[calc(100dvh-96px)] grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <Image src="/assets/chat.svg" alt="Chat SVG" width={300} height={300} />
        <h1 className="text-2xl font-semibold">Live Chat</h1>
        <p>Start Chat with our support team</p>
        <Link href={`/dashboard/support/${roomId}`}>
          <button className="btn btn-nexoro-primary">Start Chat</button>
        </Link>
      </div>
    </section>
  );
};

export default StartChat;
