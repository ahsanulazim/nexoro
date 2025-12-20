import ClientDrop from "./ClientDrop"

const ClientCard = ({ client }) => {
    return (
        <div className="card bg-base-300 shadow-xl">
            <div className="card-body">
                <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-2">
                        <div className="shrink-0 bg-white rounded-box size-12 p-3 flex items-center">
                            <img
                                className="contain"
                                src={client.logo}
                                alt={client.client}
                            />
                        </div>
                        <div>
                            <h2 className="card-title line-clamp-2">{client.client}</h2>
                            <p>{client.role}</p>
                        </div>
                    </div>
                    <ClientDrop client={client} />
                </div>
                <div className="divider my-0"></div>
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <h3 className="font-semibold">Company</h3>
                        <p className="line-clamp-1 opacity-50">{client.company}</p>
                        <h3 className="font-semibold">Email</h3>
                        <p className="wrap-break-word opacity-50">{client.email}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Phone</h3>
                        <p className="line-clamp-2 opacity-50">{client.phone || "Phone not provided"}</p>
                        <h3 className="font-semibold">Added</h3>
                        <p className="line-clamp-2 opacity-50">{new Date(client.joined).toLocaleString("en-BD", {
                            timeZone: "Asia/Dhaka",
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientCard