import { useQuery } from '@tanstack/react-query';
import { getClients } from '../Clients';
import { fetchHistoricoAgendamento } from '../agendamentosGet';
import { clientProps, IQueueEntry } from '@/app/api/types';
import { format } from 'date-fns';
import { User, CalendarDays } from 'lucide-react';
import { Status } from '@/app/api/types/status';
import { Notification } from '../notificationDate';

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

  const sheduledStatus = agendamentos?.filter((ag) => ag.status === Status.SCHEDULED);
  const sheduledStatusFinish = agendamentos?.filter((ag) => ag.status === Status.COMPLETED);
  // const priceTotal =
  // sheduledStatus?.reduce((total, agendamento) => total + agendamento.totalPrice, 0) ?? 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-black font-bold  gap-4">
        <div className="flex items-center justify-center p-4">
          <span
            className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent"
            aria-label="Carregando"
          />
        </div>
      </div>
    );
  }
  // const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  return (
    <div className="w-full bg-white h-screen p-3 text-black flex flex-col">
      <Notification />
      <h1 className="text-center p-2 font-bold text-lg">Historico de agendamentos</h1>

      <div className="border-b-2 border-black  p-2  mb-2">
        {sheduledStatus && (
          <div className="">
            <h2 className="text-center text-red-500 text-lg font-bold">
              {sheduledStatus.length === 0 ? 'Nenhum serviço pendente' : 'Serviços pendentes'}
            </h2>
            {sheduledStatus.map((sh) => {
              const itemTotal = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(sh.totalPrice || 0);
              return (
                <div
                  className="border border-gray-600 bg-gray-200  rounded-lg mb-2 p-2"
                  key={String(sh._id)}
                >
                  <h2 className="flex gap-2 items-center p-2">
                    <span>
                      <User color="#00ff" />
                    </span>
                    {sh.clientName}
                  </h2>
                  <p className="flex items-center gap-2 p-2">
                    <span>
                      <CalendarDays color="#00ff" />
                    </span>
                    {format(sh.scheduledAt, 'dd-MM-yyy HH:mm')}
                  </p>

                  <p className="flex items-center gap-2 p-2 font-bold text-lg text-green-500">
                    {itemTotal}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="w-full mt-2">
        {/*} {sheduledStatusFinish?.length === 0 && (
          <div>
            <h2 className="text-center font-medium text-black">Nenhum serviço finalizado....</h2>
          </div>
        )}*/}

        <h2 className="text-center text-blue-500 text-lg font-bold">
          {sheduledStatusFinish?.length === 0
            ? 'Nenhum serviço finalizado....'
            : 'Serviços finalizados'}
        </h2>
        {sheduledStatusFinish?.map((ag) => {
          const valorFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(ag.totalPrice);

          return (
            <div className="border border-gray-400 p-2 rounded-lg mb-2" key={String(ag._id)}>
              <div>
                <h2 className="flex gap-2 items-center p-2">
                  <span>
                    <User color="#00ff" />
                  </span>
                  {ag.clientName}
                </h2>
              </div>

              <p className="flex items-center gap-2 p-2">
                <span>
                  <CalendarDays color="#00ff" />
                </span>
                {format(ag.scheduledAt, 'dd-MM-yyyy HH:mm')}
              </p>

              <p className="flex items-center gap-2 p-2 font-bold text-lg text-green-500">
                {valorFormatado}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
