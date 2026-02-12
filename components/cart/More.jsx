'use client'

import { fetchServices } from "@/api/fetchServices";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaBolt, FaCartPlus } from "react-icons/fa6"

const More = () => {

    const [addPrice, setAddPrice] = useState({});

    const { data: services, isLoading } = useQuery({
        queryKey: ["services"],
        queryFn: fetchServices,
    })

    const handleChange = (e, service) => {
        const selectedPlan = service.plans.find(
            (plan) => plan.id === e.target.value
        );
        setAddPrice((prev) => ({
            ...prev,
            [service.title]: selectedPlan?.price || 0,
        }));
    }


    return (
        <>
            <h2 className="flex items-center gap-2 text-2xl font-semibold"><FaBolt className="text-success" />Get more Solutions from us</h2>
            <div className="divider"></div>
            <div className="flex flex-col gap-5">
                {isLoading ? <p>loading...</p> : services.map((service) =>
                    <div className="flex justify-between" key={service.title}>
                        <div>
                            <h3>{service.title}</h3>
                            <select defaultValue="" className="select mt-3" onChange={(e) => handleChange(e, service)}>
                                <option value="" disabled={true}>Select Plan</option>
                                {service.plans.map((plan) =>
                                    <option key={plan.id} value={plan.id}>{plan.planName} - ${plan.price}</option>
                                )}
                            </select>
                        </div>
                        <button className={`btn btn-primary ${addPrice[service.title] > 0 ? "btn-nexoro-primary" : ""}`} disabled={!addPrice[service.title] || addPrice[service.title] === 0}
                        ><FaCartPlus />${addPrice[service.title] || 0}
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default More