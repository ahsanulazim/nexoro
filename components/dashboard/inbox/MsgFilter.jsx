'use client'

import { useState } from "react";
import MsgList from "./MsgList";

const MsgFilter = ({ msgs }) => {

    const [filter, setFilter] = useState("all");

    // filter logic
    const filteredMsgs = msgs.filter((msg) => {
        if (filter === "all") return true;
        if (filter === "unread") return !msg.read;
        if (filter === "read") return msg.read;
        return true;
    });


    return (
        <>
            <li className="p-4 pb-2 tracking-wide flex gap-2">
                <button className={`btn btn-sm rounded-md ${filter === "all" ? "btn-primary btn-nexoro-primary" : "btn-outline opacity-60"}`} onClick={() => setFilter("all")}>
                    All
                </button>
                <button className={`btn btn-sm rounded-md ${filter === "unread" ? "btn-primary btn-nexoro-primary" : "btn-outline opacity-60"}`} onClick={() => setFilter("unread")}>
                    Unread
                </button>
                <button className={`btn btn-sm rounded-md ${filter === "read" ? "btn-primary btn-nexoro-primary" : "btn-outline opacity-60"}`} onClick={() => setFilter("read")}>
                    Read
                </button>
            </li>
            {filteredMsgs.map((msg) => (
                <MsgList key={msg._id} msg={msg} />
            ))}
        </>
    )
}

export default MsgFilter
