'use client';

import { Agendar } from './agendar';
import { useState } from 'react';
import { Historico } from '../component/historico';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [active, setActive] = useState<boolean>(true);

  function onMudarAba() {
    setActive(false);
  }
  async function handleLogout() {
    const res = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await res.json();
    router.replace('/');
  }

  return (
    <div className="flex flex-col relative bg-white text-black min-h-screen ">
      <div className="flex items-center justify-center gap-3 p-3 border-b">
        <button
          onClick={() => setActive(true)}
          className={`rounded-lg p-2 text-white text-md font-light ${active ? 'bg-blue-500' : 'bg-black'}`}
        >
          Agendar
        </button>

        <button
          onClick={() => setActive(false)}
          className={`rounded-lg p-2 text-md font-light text-white font-mediun ${active ? 'bg-black' : 'bg-blue-500'}`}
        >
          Historico
        </button>
        <button onClick={handleLogout} className="absolute p-2  right-1 cursor-pointer">
          <LogOut size={23} color="rgb(255, 0, 0)" />
        </button>
      </div>
      {/* Uso de operador ternário para trocar a exibição */}

      {active ? <Agendar agendar={active} onMudarAba={onMudarAba} /> : <Historico />}
    </div>
  );
}
