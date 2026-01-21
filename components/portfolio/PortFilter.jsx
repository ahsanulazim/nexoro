import PortfolioCategory from "./PortfolioCategory"

const PortFilter = ({ children }) => {
    return (
        <div className="drawer lg:hidden">
            <input id="filter" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex justify-center">
                {/* Page content here */}
                {children}
            </div>
            <div className="drawer-side z-60">
                <label htmlFor="filter" aria-label="close sidebar" className="drawer-overlay"></label>
                <PortfolioCategory className="min-h-full w-80 p-4" />
            </div>
        </div>
    )
}

export default PortFilter