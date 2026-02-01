import { LuBox, LuDollarSign, LuShoppingBasket, LuUserRound } from "react-icons/lu"
import StatsCard from "./StatsCard"

const DashboardUi = () => {

    const statuses = [
        {
            id: 0,
            title: "New Orders",
            count: 200,
            comparison: 25,
            grow: true,
            icon: <LuShoppingBasket />
        },
        {
            id: 1,
            title: "New Users",
            count: 20,
            comparison: 5,
            grow: true,
            icon: <LuUserRound />
        },
        {
            id: 2,
            title: "Pending Orders",
            count: 6,
            comparison: 2,
            grow: false,
            icon: <LuBox />
        },
        {
            id: 3,
            title: "Earning",
            count: 200000,
            comparison: 40,
            grow: true,
            icon: <LuDollarSign />
        },
    ]

    return (
        <main>
            <section>
                <div className="grid grid-cols-4 gap-5">
                    {statuses.map((status) =>
                        <StatsCard key={status.id} status={status} />
                    )}
                </div>
            </section>
        </main>
    )
}

export default DashboardUi