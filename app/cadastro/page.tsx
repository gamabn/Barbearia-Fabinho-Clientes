'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Input } from '../component/Input';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const cadastroSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório.' }),
  phone: z.string().refine(
    (value) =>
      /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || // (DD) 999999999
      /^\d{2}\s\d{9}$/.test(value) || // DD 999999999
      /^\d{11}$/.test(value), // 11999999999
    {
      message: 'O número de telefone deve estar no formato (DD) 999999999 ou similar.',
    }
  ),
});

type CadastroForm = z.infer<typeof cadastroSchema>;

export default function Cadastro() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema),
  });

  const onSubmit = (data: CadastroForm) => {
    setLoading(true);

    fetch('/api/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao cadastrar');
        }
        return response.json();
      })
      .then((responseData) => {
        console.log('Cadastro realizado com sucesso:', responseData);
        toast.success('Cadastro realizado com sucesso!');
        router.push('/login');
      })
      .catch((error) => {
        console.error('Erro ao cadastrar:', error);
        toast.error('Ocorreu um erro ao cadastrar. Por favor, tente novamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="flex flex-col items-center bg-white text-black justify-center h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 max-sm:text-xl">Fabinho Barbearia</h1>

      <Image src="/icon-192.png" alt="Logo" width={100} height={100} className="mb-4" />

      <form
        className="flex flex-col w-96 max-sm:w-80  p-6  bg-white max-sm:p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm">Nome</label>
        <Input
          type="text"
          name="name"
          placeholder="Digite seu nome"
          register={register}
          error={errors.phone?.message}
        />

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
          type="submit"
        >
          {loading ? (
            <span
              className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
              aria-label="Carregando"
            />
          ) : (
            'Cadastrar'
          )}
        </button>

        <Link
          href="/login"
          className="text-sm text-center font-extralight text-[#2323da] py-3 hover:underline cursor-pointer "
        >
          Se ja tem conta? Entrar
        </Link>
      </form>
    </div>
  );
}
