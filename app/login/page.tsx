"use client"

import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from "next/link"
import { toast } from "react-toastify"
import { Input } from "../component/Input"
import Image from "next/image"
import { useState } from "react"
import { Agend } from "../component/Service-barber"
import { useQuery } from "@tanstack/react-query"
import { getClients } from "../component/Clients"
import { useRouter } from "next/navigation";

const loginSchema = z.object({
   
     phone: z
        .string()
        .refine(
            (value) =>
            /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || // (DD) 999999999
            /^\d{2}\s\d{9}$/.test(value) || // DD 999999999
            /^\d{11}$/.test(value), // 11999999999
            {
            message: "O número de telefone deve estar no formato (DD) 999999999 ou similar.",
            }
        ),
})

export default function Login(){
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    })

     const {
    data: services = [],
   // isLoading: loading,
    error
  } = useQuery({
    queryKey: ["services"],
    queryFn: Agend
  })


    const onSubmit = (data: any) => {
        setLoading(true);
        try {
            fetch("/api/login-client", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao realizar login");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Login realizado com sucesso:", data);
                // Aqui você pode redirecionar o usuário para a página de dashboard ou outra página
                return router.push("/dashboard");
            })
            .catch((error) => {
                console.error("Erro ao realizar login:", error);
                toast.error("Ocorreu um erro ao realizar login. Por favor, tente novamente.");
            });
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            toast.error("Ocorreu um erro ao realizar login. Por favor, tente novamente.");
        }
        setLoading(false);
        toast.success("Login realizado com sucesso!")
    }

    return(
   <div className="flex flex-col items-center justify-center h-screen">

   
   
    <h1 className="text-2xl font-bold text-gray-800 mb-4 max-sm:text-xl">Fabinho Barbearia</h1>

    <Image 
    src="/icon-192.png" 
    alt="Logo" 
    width={100} 
    height={100} 
    className="mb-4"
    />

    <form 
    className="flex flex-col w-96 max-sm:w-80  p-6  bg-white max-sm:p-4"
    onSubmit={handleSubmit(onSubmit)}>
     <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm">Telefone</label>
                <Input 
                type="text"
                name="phone"
                placeholder="Digite seu telefone"
                register={register}
                error={errors.phone?.message}
                /> 
     
     <button
     className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors max-sm:text-sm"
      type="submit">
        {loading ? <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" aria-label="Carregando" /> : "Cadastrar"} </button>

           <Link 
            href="/cadastro"
            className="text-sm text-center font-extralight text-[#2323da] py-3 hover:underline cursor-pointer "
            >
            Se nao tem conta? Cadastre-se
            </Link>
    </form>
   </div>
    )
}