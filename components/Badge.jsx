import { FaStar } from "react-icons/fa6"

const Badge = () => {
    return (
        <span className="badge md:badge-lg rounded-full mb-2 md:mb-5 shadow-md" data-theme="light"><span className="font-black">5</span><FaStar className="text-yellow-500" />Rated By Thousands</span>
    )
}

export default Badge
