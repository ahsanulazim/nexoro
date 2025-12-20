import DashBread from "@/components/dashboard/DashBread";
import SliderTab from "@/components/dashboard/sliders/SliderTab";
import { LuPlus } from "react-icons/lu";

const page = () => {
    return (
        <main className="flex flex-col gap-4">
            <section className="">
                <DashBread title="Sliders" />
                <div className="flex items-center justify-between gap-5">
                    <h1 className="text-4xl font-semibold">Sliders</h1>
                    <button
                        className="btn btn-primary btn-nexoro-primary"
                    >
                        <LuPlus />
                        Add Slider
                    </button>
                </div>
            </section>
            <SliderTab />
        </main>
    )
}

export default page
