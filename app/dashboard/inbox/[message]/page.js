import DashBread from "@/components/dashboard/DashBread"
import MsgFull from "@/components/dashboard/inbox/MsgFull";

const page = async ({ params }) => {
    const { message } = await params;

    const read = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/messages/${message}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/messages/${message}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const msg = await res.json();

    return (
        <>
            <main className="flex flex-col gap-4">
                <section className="">
                    <DashBread title="Inbox" subtitle="Messages" />
                    <h1 className="text-4xl font-semibold">Messages</h1>
                </section >
                <MsgFull msg={msg.message} />
            </main >
        </>
    )
}

export default page
