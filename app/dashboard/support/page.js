"use client";
import ChatNav from "@/components/dashboard/inbox/ChatNav";
import Conversation from "@/components/dashboard/inbox/Conversation";
import { useContext } from "react";
import { MyContext } from "@/context/MyProvider";

const page = () => {
  const { currentUser } = useContext(MyContext);

  return (
    <>
      <ChatNav />
      <Conversation
        currentRoom={`room_${currentUser?.user?._id}`}
        activeUser={null}
      />
    </>
  );
};

export default page;
