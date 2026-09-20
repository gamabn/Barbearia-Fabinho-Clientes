'use client';

import { useAgendamentosHoook } from '../hook/useAgendamentos';
import { Status } from '@/app/api/types/status';
import { differenceInDays, differenceInHours, parseISO, isAfter } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
import { Scissors, User, X } from 'lucide-react';

export function Notification({ children }: { children: React.ReactNode }) {
  const { agendamentos } = useAgendamentosHoook();
  const [active, setActive] = useState<boolean>(true);

  // 1. Filtra APENAS agendamentos confirmados cuja data é no futuro
  const notificacoesFuturas = useMemo(() => {
    if (!agendamentos || agendamentos.length === 0) return [];

    const agora = new Date();
    return agendamentos
      .filter((ag) => ag.status === Status.SCHEDULED)
      .filter((ag) => {
        const dataAgendamento =
          typeof ag.scheduledAt === 'string' ? parseISO(ag.scheduledAt) : ag.scheduledAt;
        return isAfter(dataAgendamento, agora);
      });
  }, [agendamentos]);

  // 2. Fecha automaticamente após 4 segundos somente se houver notificações
  useEffect(() => {
    if (active && notificacoesFuturas.length > 0) {
      const timer = setTimeout(() => {
        setActive(false);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [active, notificacoesFuturas.length]);

  return (
    <div className="">
      {/* 
        SÓ renderiza a caixa com borda se:
        1. active for true
        2. Existir de verdade pelo menos 1 agendamento futuro
        Se não houver agendamento futuro, NADA é desenhado na tela (zero bordas vazias).
      */}
      {active && notificacoesFuturas.length > 0 && (
        <div className="flex flex-col bg-white border-2 border-black shadow-xl p-4 m-3 rounded-lg text-black transition-all">
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-200">
            <h2 className="text-sm font-bold text-red-600 uppercase tracking-wide">
              Lembrete de Agendamento
            </h2>
            <button
              onClick={() => setActive(false)}
              className="text-gray-500 hover:text-black p-1 transition-colors cursor-pointer"
              title="Fechar aviso"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {notificacoesFuturas.map((ag) => {
              const dataAgendamento =
                typeof ag.scheduledAt === 'string' ? parseISO(ag.scheduledAt) : ag.scheduledAt;
              const agora = new Date();

              const diasFaltando = differenceInDays(dataAgendamento, agora);
              const horasFaltando = differenceInHours(dataAgendamento, agora);

              let mensagem = '';
              if (diasFaltando > 0) {
                mensagem = `Faltam ${diasFaltando} ${diasFaltando === 1 ? 'dia' : 'dias'} para o seu serviço agendado.`;
              } else if (horasFaltando > 0) {
                mensagem = `Seu serviço é hoje! Restam apenas ${horasFaltando} ${horasFaltando === 1 ? 'hora' : 'horas'}.`;
              } else {
                mensagem = `Seu serviço começará em menos de uma hora! Fique atento.`;
              }

              const itemTotal = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(ag.totalPrice || 0);

              const servicosFormatados = Array.isArray(ag.nomesDosServicos)
                ? ag.nomesDosServicos.join(', ')
                : ag.nomesDosServicos;

              return (
                <div
                  key={String(ag._id)}
                  className="rounded-md  bg-gray-50 p-3 border border-gray-400"
                >
                  <p className="text-base text-red-600 font-semibold">{mensagem}</p>

                  <div className="mt-2 text-sm text-gray-800 flex flex-col gap-1">
                    <p className="flex items-center gap-2">
                      <User size={16} color="#00ff" />
                      <span className="font-medium">{ag.clientName}</span>
                    </p>

                    {servicosFormatados && (
                      <p className="flex items-center gap-2">
                        <Scissors size={16} color="#00ff" />
                        <span>{servicosFormatados}</span>
                      </p>
                    )}

                    <p className="text-base text-green-600 font-bold mt-1">{itemTotal}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* O conteúdo do site SEMPRE carrega normalmente */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
