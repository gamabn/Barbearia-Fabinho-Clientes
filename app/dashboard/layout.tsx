import { cookies } from "next/headers";

export default async function LayoutDashboard({ children }: LayoutProps<"/dashboard">) {
  const cookieStore = await cookies();
    const clientId = cookieStore.get("clientId")?.value;

    if (!clientId) {
        return (
            <html lang="en" className="h-full antialiased">
                <body className="min-h-full flex flex-col">
                    <div className="flex flex-col items-center justify-center h-screen">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4 max-sm:text-xl">Acesso Negado</h1>
                        <p className="text-gray-600 max-sm:text-base">Você não tem permissão para acessar esta página.</p>
                    </div>
                </body>
            </html>
        );
    }
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
