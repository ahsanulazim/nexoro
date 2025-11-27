import Link from "next/link";
import { FaEllipsisVertical, FaEnvelope, FaEye, FaPhone, FaRegCalendarDays, FaTrashCan } from "react-icons/fa6";

export default function MsgList({ msg }) {
    return (
        <li className="list-row items-center" key={msg._id}>
            <Link href={`/dashboard/inbox/${msg._id}`} className="list-col-grow flex-1 min-w-0">
                <h3 className="font-bold uppercase">{msg.name}{" "}{!msg.read &&
                    <span className="text-main">*</span>}</h3>
                <p className="text-xs opacity-60 truncate">{msg.message}</p>
                <span className="text-xs flex items-center gap-2 mt-1 opacity-60"><FaRegCalendarDays />{new Date(msg.added).toLocaleString("en-BD", {
                    timeZone: "Asia/Dhaka",
                    dateStyle: "medium",
                    timeStyle: "short",
                })}</span>
            </Link>
            <div className="dropdown dropdown-end">
                <button tabIndex={0} role="button" className="btn m-1 btn-soft btn-info btn-square btn-sm md:btn-md"><FaEllipsisVertical /></button>
                <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-md">
                    <li><Link href={`/dashboard/inbox/${msg._id}`} className="list-col-grow "><FaEye className="text-success" /> View</Link></li>
                    {msg.phone && <li><a href={`tel:${msg.phone}`}><FaPhone className="text-info" /> Call</a></li>}
                    <li><a href={`mailto:${msg.email}`}><FaEnvelope
                        className="text-warning" /> Send Email</a></li>
                    <li>
                        <button><FaTrashCan className="text-error" /> Delete</button>
                    </li>
                </ul>
            </div>
        </li>
    )
}
