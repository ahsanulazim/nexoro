import { deleteClient } from "@/api/fetchClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEllipsisVertical, FaTrashCan } from "react-icons/fa6"
import { LuSquarePen } from "react-icons/lu"
import ClientEdit from "./ClientEdit";
import { useRef } from "react";

const ClientDrop = ({ client }) => {

    const { public_id, email } = client
    const clientRef = useRef()
    const queryClient = useQueryClient();

    const { mutate: removeClient, isPending } = useMutation({
        mutationFn: ({ email, public_id }) => deleteClient(email, public_id),
        onMutate: async ({ email }) => {
            await queryClient.cancelQueries({ queryKey: ["clientData"] });
            const previousClients = queryClient.getQueryData(["clientData"]);
            queryClient.setQueryData(["clientData"], (oldClients) =>
                oldClients.filter((client) => client.email !== email)
            );
            return { previousClients };
        },
        onError: (err, context) => {
            toast.error(err.message);
            queryClient.setQueryData(["clientData"], context.previousClients);
        },
        onSettled: () => {
            toast.success("Client deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["clientData"] });
        },
    });

    return (
        <>
            <ClientEdit ref={clientRef} client={client} />
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
                        <button onClick={() => clientRef.current.showModal()}>
                            <LuSquarePen className="text-success" /> Edit
                        </button>
                    </li>
                    <li>
                        <button onClick={() => removeClient({ public_id, email })} disabled={isPending}>
                            <FaTrashCan className="text-error" /> Delete
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default ClientDrop