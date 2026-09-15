import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
//import { Header } from "../component/header";

export default async function LayoutDashboard({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const clientId = cookieStore.get('clientId')?.value;

  if (!clientId) {
    return (
      <div className="flex flex-col h-full bg-white text-black items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 max-sm:text-xl">Acesso Negado</h1>
        <p className="text-gray-600 max-sm:text-base">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      {/*<Header />*/}
      {children}
    </div>
  );
}
