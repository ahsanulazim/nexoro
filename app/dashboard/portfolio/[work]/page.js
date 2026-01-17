import DashBread from '@/components/dashboard/DashBread'
import EditPortfolio from '@/components/dashboard/portfolio/EditPortfolio';

const Work = async ({ params }) => {

    const { work } = await params;

    const workData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio/${work}`).then(res => res.json())


    return (
        <main className="flex flex-col gap-4">
            <section className="">
                <DashBread title="Portfolio" subtitle="Edit Portfolio" />
                <div className="flex items-center justify-between gap-5">
                    <h1 className="text-4xl font-semibold">Edit Portfolio</h1>
                </div>
            </section>
            <section>
                {/* Edit Portfolio */}
                <EditPortfolio work={workData} />
            </section>
        </main>
    )
}

export default Work