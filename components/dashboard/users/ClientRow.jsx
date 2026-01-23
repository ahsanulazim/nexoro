"use client";

import { demoteMember, promoteUser } from "@/api/fetchUsers";
import auth from "@/firebase/firebase.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import { LuArrowBigDownDash, LuArrowBigUpDash, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";

const ClientRow = ({ client, btn, customer }) => {
  const [user] = useAuthState(auth);

  const queryClient = useQueryClient();

  const { mutate: promoteMutation, isPending } = useMutation({
    mutationFn: (email) => promoteUser(email),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData(["users"]);
      queryClient.setQueryData(["users"], (oldUsers) =>
        Array.isArray(oldUsers)
          ? oldUsers.map((user) =>
            user.email === client.email ? { ...user, role: "member" } : user
          )
          : []
      );
      return { previousUsers };
    },
    onSuccess: () => {
      toast.success(`${client.userName} has been promoted to member.`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });

    },
    onError: (error, variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(["users"], context.previousUsers);
    }
  });

  const { mutate: demoteMutation, isPending: isDemoting } = useMutation({
    mutationFn: (email) => demoteMember(email),
    onSuccess: () => {
      toast.success(`${client.userName} has been demoted to user.`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onMutate: async (email) => {
      await queryClient.cancelQueries({ queryKey: ["members"] });
      const previousMembers = queryClient.getQueryData(["members"]);
      queryClient.setQueryData(["members"], (oldMembers) =>
        Array.isArray(oldMembers)
          ? oldMembers.map((user) =>
            user.email === email ? { ...user, role: "user" } : user
          )
          : []
      );
      return { previousMembers };
    },
    onError: (error, variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(["members"], context.previousMembers);
    }

  });


  const handlePromote = () => {
    promoteMutation(client.email);
  }

  const handleDemote = () => {
    demoteMutation(client.email);
  }

  return (
    <>
      <tr className="hover:bg-base-300">
        <td className="w-full">
          <h3 className="font-bold">{client.userName}</h3>
          <p className="opacity-60">{client.email}</p>
        </td>
        <td className="w-auto whitespace-nowrap">
          <div className="flex gap-5">
            <button className={`btn ${customer ? "btn-success" : "btn-warning"} btn-sm md:btn-md rounded-md`} onClick={customer ? handlePromote : handleDemote} disabled={isPending || isDemoting}>
              {customer ? <><LuArrowBigUpDash /> Make Member </> : <><LuArrowBigDownDash /> Demote Member</>}
            </button>
            <button className="btn btn-error btn-sm md:btn-md rounded-md" disabled={client.email === user.email ? true : false} onClick={btn}>
              <LuTrash2 /> Remove
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ClientRow;
