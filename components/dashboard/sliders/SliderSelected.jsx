import { LuTag, LuX } from "react-icons/lu"

const SliderSelected = ({ selected, handleSelect, data }) => {

    const carousel = data?.find((d) => d?._id === selected)

    return (
        <div className="badge badge-success">
            <LuTag /> {carousel?.client} <button className="cursor-pointer" onClick={() => handleSelect(selected)}><LuX /></button>
        </div>
    )
}

export default SliderSelected