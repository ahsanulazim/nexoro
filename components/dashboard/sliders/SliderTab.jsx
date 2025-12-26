import SliderContent from "./SliderContent"

const SliderTab = () => {
    return (
        <>
            {/* name of each tab group should be unique */}
            <div className="tabs tabs-lift">
                <input type="radio" name="my_tabs_6" className="tab" aria-label="Client Logos" defaultChecked />
                <div className="tab-content bg-base-100 border-base-300 p-6"><SliderContent /></div>
            </div>
        </>
    )
}

export default SliderTab