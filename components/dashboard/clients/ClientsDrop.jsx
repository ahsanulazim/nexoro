import { deleteClient } from "@/api/fetchClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuEllipsisVertical, LuSquarePen, LuTrash2 } from "react-icons/lu"
import { toast } from "react-toastify";
import ClientEdit from "./ClientEdit";
import { useRef } from "react";

const ClientsDrop = ({ client }) => {

    const editClient = useRef();
    const { email, public_id } = client;

    const queryClient = useQueryClient();

    //delete client
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
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Client removed successfully");
                queryClient.invalidateQueries({ queryKey: ["clientData"] });
            } else {
                toast.error(data.message || "Failed to remove client");
            }
        },
        onError: (err, email, context) => {
            toast.error("Something went wrong while deleting");
            queryClient.setQueryData(["clientData"], context.previousClients);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["clientData"] });
        },
    });

    return (
        <>
            <ClientEdit ref={editClient} client={client} />
            <div className="dropdown dropdown-end">
                <button
                    tabIndex={0}
                    role="button"
                    className="btn btn-soft btn-square"
                >
                    <LuEllipsisVertical />
                </button>
                <ul
                    tabIndex="-1"
                    className="dropdown-content menu bg-base-100 rounded-box z-1 hn w-52 p-2 shadow-sm"
                >
                    <li>
                        <button onClick={() => editClient.current.showModal()}><LuSquarePen /> Edit</button>
                    </li>
                    <li>
                        <button className="text-error hover:bg-error hover:text-error-content" onClick={() => removeClient({ email, public_id })}
                            disabled={isPending}>
                            <LuTrash2 />
                            Delete
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default ClientsDrop
