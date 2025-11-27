import { FaEnvelope, FaPhone, FaRegCalendarDays } from "react-icons/fa6"

const MsgFull = ({ msg }) => {
    return (
        <div className="bg-base-200 shadow-md rounded-lg p-5 mt-5">
            <div>
                <p> {msg.message}</p>
                <div className="mt-5">
                    <h4><span className="font-bold">Author :</span> {msg.name}</h4>
                    <a href={`mailto:${msg.email}`} className="w-fit text-gray-500 flex gap-x-2 items-center"
                    ><FaEnvelope /> {msg.email}</a>
                    <a href={`tel:${msg.phone}`}
                        className="w-fit text-gray-500 flex gap-x-2 items-center"><FaPhone /> {msg.phone}
                    </a>
                    <p className="flex items-center gap-x-2 text-gray-500 w-fit">
                        <FaRegCalendarDays />{new Date(msg.added).toLocaleString("en-BD", {
                            timeZone: "Asia/Dhaka",
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default MsgFull
