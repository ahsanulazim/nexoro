import { FaEllipsisVertical, FaTrashCan } from "react-icons/fa6"
import { LuSquarePen } from "react-icons/lu"

const ClientDrop = ({ client }) => {
    return (
        <>

            <div className="dropdown dropdown-end">
                <button
                    tabIndex={0}
                    role="button"
                    className="btn m-1 btn-soft btn-primary btn-square btn-sm"
                >
                    <FaEllipsisVertical />
                </button>
                <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-md"
                >
                    <li>
                        <button>
                            <LuSquarePen className="text-success" /> Edit
                        </button>
                    </li>
                    <li>
                        <button>
                            <FaTrashCan className="text-error" /> Delete
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default ClientDrop