"use client"

import { useQuery } from "@tanstack/react-query"
import { getClients } from "../component/Clients";
import { Agend } from "../component/Service-barber";


export default function Dashboard() {
   
       const {
        data: clients ,
        isLoading: clientsLoading
    } = useQuery({
        queryKey: ["clients"],
        queryFn: getClients
    })

    const {
        data: services = [],
        isLoading: servicesLoading
    } = useQuery({
        queryKey: ["services"],
        queryFn: Agend
    })


    return (
        <div className="flex flex-col p-3 bg-white text-black min-h-screen py-2">
            <h1 className="text-2xl text-center font-bold">Fabinho Barbearia</h1>

            <section className="flex flex-col gap-4 mt-4">
                <div className="flex items-center justify-center gap-2 border-b border-gray-300 pb-2">
                {clientsLoading ? (
                    <p>Carregando clientes...</p>
                ) : (
                  
                        <div key={clients.id}>
                            <h2>{clients.name}</h2>
                            <p>{clients.phone}</p>
                        </div>
                    
                )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {servicesLoading ? (
                    <p>Carregando serviços...</p>
                ) : (
                    services.map((service: any) => (
                        <button key={service._id} className="flex border bg-gray-100 border-gray-300 p-2 rounded-lg hover:bg-gray-200 items-center justify-center gap-2">
                            <h2>{service.name}</h2>
                            <p>R$ {service.price}</p>
                        </button>
                    ))
                )}
                </div>
            </section>
           
        </div>
    )
}