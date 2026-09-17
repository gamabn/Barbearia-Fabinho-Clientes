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

  // 1. Filtra apenas os serviços que estão agendados
  const sheduledStatus = agendamentos?.filter((ag) => ag.status === Status.SCHEDULED) || [];

  if (isLoading || loading) {
    return <div className="p-4 text-center text-gray-500">Carregando avisos...</div>;
  }

  return (
    <div className="w-full p-4">
      <h1 className="text-lg font-bold text-gray-800 mb-3">Notificações</h1>

      {sheduledStatus.length === 0 ? (
        <p className="text-sm text-gray-500">Você não tem nenhum serviço agendado.</p>
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
                <div
                  key={String(ag._id)}
                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm"
                >
                  <p className="text-sm font-semibold text-blue-900">{mensagem}</p>
                  <p className="text-xs text-blue-700 mt-1">Serviço de: {ag.clientName}</p>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
}
