import { deleteClient } from "@/api/fetchClients";
import { formatTime } from "@/date/dateCalc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import ClientEdit from "./ClientEdit";

const ClientsTable = ({ client }) => {
  const formatDate = formatTime(new Date(client.joined));

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
    <tr key={client.email}>
      <th>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </th>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={client.logo} alt={client.client} />
            </div>
          </div>
          <div>
            <div className="font-bold">{client.client}</div>
            <div className="text-sm opacity-50">{client.role}</div>
          </div>
        </div>
      </td>
      <td>
        {client.company}
        <br />
        <p className="text-sm opacity-50">{client.email}</p>
      </td>
      <td>{formatDate}</td>
      <td>
        <div className="flex items-center gap-2">
          <ClientEdit client={client} />
          <button
            className="btn btn-sm btn-square btn-soft btn-error"
            onClick={() => removeClient({ email, public_id })}
          >
            <LuTrash2 />
          </button>
          <label
            htmlFor={`editClient-${client._id}`}
            className="btn btn-sm btn-square btn-soft btn-info"
          >
            <LuSquarePen />
          </label>
        </div>
      </td>
    </tr>
  );
};

export default ClientsTable;
