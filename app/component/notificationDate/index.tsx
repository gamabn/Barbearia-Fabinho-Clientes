'use client';
import { useClientHook } from '../hook/useAgendamentos';
import { useAgendamentosHoook } from '../hook/useAgendamentos';
import { Status } from '@/app/api/types/status';
import { differenceInDays, differenceInHours, parseISO, isAfter } from 'date-fns';
import { useState, useEffect } from 'react';

export function Notification() {
  const { clients, isLoading } = useClientHook();
  const { agendamentos, loading } = useAgendamentosHoook();
  const [active, setActive] = useState<boolean>(true);

  console.log('Cliente cadastrado', clients);

  useEffect(() => {
    if (active) {
      const timeNotification = setTimeout(() => {
        setActive(false);
      }, 400);

      return () => clearTimeout(timeNotification);
    }
  }, [active]);

  // 1. Filtra apenas os serviços que estão agendados
  const sheduledStatus = agendamentos?.filter((ag) => ag.status === Status.SCHEDULED) || [];

  if (isLoading || loading) {
    return <div className="p-4 text-center text-gray-500">Carregando avisos...</div>;
  }

  return (
    <div className=" flex justify-center items-center w-full">
      <div className="flex flex-col bg-black p-4 rounded-lg text-white text-md">
        <h1 className="text-lg font-bold text-red-500 mb-3">
          Notificações de agendamento pendente
        </h1>

        {sheduledStatus.length === 0 ? (
          <p className="text-sm text-white">Você não tem nenhum serviço agendado.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sheduledStatus.map((ag) => {
              // Converte a data do banco para um objeto Date seguro
              const dataAgendamento =
                typeof ag.scheduledAt === 'string' ? parseISO(ag.scheduledAt) : ag.scheduledAt;

              const agora = new Date();

              // Só mostra a notificação se o serviço for no futuro
              if (isAfter(dataAgendamento, agora)) {
                const diasFaltando = differenceInDays(dataAgendamento, agora);
                const horasFaltando = differenceInHours(dataAgendamento, agora);

                let mensagem = '';

                // 2. LÓGICA DE DIAS E HORAS
                if (diasFaltando > 0) {
                  // Se faltar 1 dia ou mais
                  mensagem = `Faltam ${diasFaltando} ${diasFaltando === 1 ? 'dia' : 'dias'} para o seu serviço agendado.`;
                } else if (horasFaltando > 0) {
                  // Se faltar menos de 1 dia, mas ainda restarem horas
                  mensagem = `Seu serviço é hoje! Restam apenas ${horasFaltando} ${horasFaltando === 1 ? 'hora' : 'horas'}.`;
                } else {
                  // Se faltar menos de 1 hora
                  mensagem = `Seu serviço começará em menos de uma hora! Fique atento.`;
                }

                return (
                  <div key={String(ag._id)} className="p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold ">{mensagem}</p>
                    <p className="text-xs  mt-1">Serviço de: {ag.clientName}</p>
                    <div>
                      <p></p>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
