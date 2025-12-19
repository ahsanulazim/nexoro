import ClientDrop from "./ClientDrop"

const ClientCard = ({ client }) => {
    return (
        <div className="card bg-base-300 shadow-xl">
            <div className="card-body">
                <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-2">
                        <div className="shrink-0 bg-white rounded-box size-12 p-3">
                            <img
                                className="contain"
                                src={client.logo}
                                alt={client.client}
                            />
                        </div>
                        <div>
                            <h2 className="card-title line-clamp-2">{client.client}</h2>
                        </div>
                    </div>
                    <ClientDrop client={client} />
                </div>
                <div>
                    <h3 className="font-semibold">Short Description:</h3>
                    <p className="line-clamp-1 opacity-50">{service.shortDes}</p>
                    <h3 className="font-semibold">Long Description:</h3>
                    <p className="line-clamp-2 opacity-50">{service.longDes}</p>
                </div>
            </div>
        </div>
    )
}

export default ClientCard