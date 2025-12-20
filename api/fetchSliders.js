//add a slider
export const addSlider = async (data) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/sliders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
    });

    if (!res.ok) {
        throw new Error("Failed to add slider");
    }

    return res.json();
}