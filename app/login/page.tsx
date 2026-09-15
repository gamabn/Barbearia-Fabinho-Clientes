'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Input } from '../component/Input';
import Image from 'next/image';
import { useState } from 'react';
//import { Agend } from "../component/Service-barber"
//import { useQuery } from "@tanstack/react-query"
//import { getClients } from "../component/Clients"
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  phone: z
    .string()
    .min(1, 'O telefone é obrigatório')
    .refine(
      (val) => /^\(\d{2}\) \d{5}-\d{4}$/.test(val),
      'O número de telefone deve estar no formato (DD) 99999-9999'
    ),
});
//================================================
// phone: z.string().refine(
// (value) =>
//    /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || // (DD) 999999999
//   /^\d{2}\s\d{9}$/.test(value) || // DD 999999999
//   /^\d{11}$/.test(value), // 11999999999
//{
//  message: 'O número de telefone deve estar no formato (DD) 999999999 ou similar.',
// }
// ),
//});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | ''>('');
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setErrorMessage('');

    const cleanPhone = data.phone.replace(/\D/g, ''); // Retorna apenas '21970280382'

    try {
      const response = await fetch('/api/login-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          phone: cleanPhone,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        // throw new Error('Erro ao realizar login');
        setErrorMessage(result.error || 'Telefone ou senha inválidos.');
        return;
      }
      // window.location.href = "/dashboard";
      router.replace('/dashboard');
      //  router.push('/dashboard')
      // window.location.assign("/dashboard");
      // const res = await response.json()
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      setErrorMessage('Erro de conexão. Tente novamente.');
      toast.error('Ocorreu um erro ao realizar login. Por favor, tente novamente.');
      reset();
    } finally {
      setLoading(false); // Executado tanto no sucesso quanto no erro
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 max-sm:text-xl">Login</h1>

      <Image
        src="/icon-192.png"
        alt="Logo"
        width={100}
        height={100}
        loading="eager"
        className="mb-4"
      />

      <form
        className="flex flex-col w-96 max-sm:w-80  p-6  bg-white max-sm:p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/*} <input
                    type="text"
                    {...register("phone")}
                   placeholder="Telefone"
                    />  */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {errorMessage}
          </div>
        )}
        <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm">Telefone</label>
        <Input
          placeholder="Telefone"
          type="text"
          name="phone"
          register={register}
          error={errors.phone?.message}
          isPhone={true} // Ativa a máscara para este input
        />
        {/* Exibe o erro na tela se existir */}

        {/*} {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}  */}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors max-sm:text-sm"
          type="submit"
          disabled={loading}
        >
          <span className="flex items-center justify-center gap-2">
            <span className={loading ? 'inline-block' : 'hidden'}>
              <span
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
            </span>

            {/*} <span>{loading ? 'Entrando...' : 'Entrar'}</span>  */}
            <span>Entrar</span>
          </span>
        </button>

        <Link
          href="/cadastro"
          className="text-sm text-center font-extralight text-[#2323da] py-3 hover:underline cursor-pointer "
        >
          Se nao tem conta? Cadastre-se
        </Link>
      </form>
    </div>
  );

  {
    /*}  return(
   <div className="flex flex-col items-center justify-center h-screen">
    
        <h1 "className="text-2xl font-bold text-gray-800 mb-4 max-sm:text-xl>Fabinho Barbearia</h1>

        <Image 
        src="/icon-192.png" 
        alt="Logo" 
        width={100} 
        height={100} 
        loading="eager"
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

                  {/*}  <input  
                       type="text"
                        placeholder="Digite seu telefone"
                        {...register("phone")}
                        className="border p-2"
                    > 
        
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
    )   */
  }
}
