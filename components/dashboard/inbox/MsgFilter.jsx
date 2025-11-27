'use client'

import { useState } from "react";

const MsgFilter = () => {

    const [filter, setFilter] = useState("all");

    return (
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
    )
}

export default MsgFilter
