import DashBread from "@/components/dashboard/DashBread";
import Msgs from "@/components/dashboard/inbox/Msgs";

const page = () => {
    return (
        <>
            <main className="flex flex-col gap-4">
                <section className="">
                    <DashBread title="Inbox" />
                    <h1 className="text-4xl font-semibold">Inbox</h1>
                </section >
                <Msgs />
            </main >
        </>
    )
}

export default page
