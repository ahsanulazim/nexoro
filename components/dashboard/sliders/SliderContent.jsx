'use client'
import { LuImage, LuPlus } from "react-icons/lu"
import SliderAddModal from "./SliderAddModal"
import { fetchClients } from "@/api/fetchClients";
import { useQuery } from "@tanstack/react-query";

const SliderContent = () => {

    const { data: clientData, isLoading } = useQuery({
        queryKey: ["clientData"],
        queryFn: fetchClients,
    });

    return (
        <>
            <div className="flex items-center justify-between gap-5">
                <h1 className="flex items-center gap-2 font-semibold"><LuImage /> Slides</h1>
                <button className="btn btn-primary btn-nexoro-primary" onClick={() => document.getElementById('sliderModal').showModal()}> <LuPlus /> Add a Slide </button>
            </div>
            <SliderAddModal data={clientData} />
        </>
    )
}

export default SliderContent