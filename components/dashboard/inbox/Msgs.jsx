import MsgFilter from "./MsgFilter";
import MsgList from "./MsgList";

const Msgs = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/messages`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const msgs = await res.json();

    return (
        <ul className="list bg-base-200 rounded-box shadow-md mt-5">
            <MsgFilter msgs={msgs} />
        </ul>
    )
}

export default Msgs
