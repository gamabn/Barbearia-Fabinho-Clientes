import { useQuery } from '@tanstack/react-query';
import { getClients } from '../Clients';
import { fetchHistoricoAgendamento } from '../agendamentosGet';
import { clientProps, IQueueEntry } from '@/app/api/types';
import { format, isToday } from 'date-fns';

export function Historico() {
  const { data: clients } = useQuery<clientProps>({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const { data: agendamentos, isLoading: loading } = useQuery<IQueueEntry[]>({
    queryKey: ['agendamentos', clients?.id],
    queryFn: () => fetchHistoricoAgendamento(clients?.id ?? null),
    enabled: !!clients?.id,
  });

  if (loading) {
    return (
      <div>
        <span>carregando...</span>
      </div>
    );
  }
  // const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  return (
    <div className="w-full h-screen p-3 text-black flex flex-col">
      <h1 className="text-center p-2 font-bold text-lg">Historico de agendamentos</h1>

      {agendamentos?.map((ag) => {
        return (
          <div key={String(ag._id)}>
            <h2>{ag.clientName}</h2>
            <p>{format(ag.scheduledAt, 'dd-MM-yyy HH:mm')}</p>
          </div>
        );
      })}
    </div>
  );
}
