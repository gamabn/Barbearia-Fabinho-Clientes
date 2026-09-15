'use client';

import { Agendar } from './agendar';
import { useState } from 'react';
import { Historico } from '../component/historico';

export default function Dashboard() {
  const [active, setActive] = useState<boolean>(true);

  function onMudarAba() {
    setActive(false);
  }

  return (
    <div className="flex flex-col bg-white text-black min-h-screen ">
      <div className="flex items-center justify-around p-3 border-b">
        <button
          onClick={() => setActive(true)}
          className={`rounded-lg p-2 text-white font-mediun ${active ? 'bg-blue-500' : 'bg-black'}`}
        >
          Agendar
        </button>

        <button
          onClick={() => setActive(false)}
          className={`rounded-lg p-2 text-white font-mediun ${active ? 'bg-black' : 'bg-blue-500'}`}
        >
          Historico
        </button>
      </div>
      {/* Uso de operador ternário para trocar a exibição */}
      {active ? <Agendar agendar={active} onMudarAba={onMudarAba} /> : <Historico />}
    </div>
  );
}
