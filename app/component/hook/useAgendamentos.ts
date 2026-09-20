'use client';
import { useQuery } from '@tanstack/react-query';
import { clientProps, IQueueEntryWithServices, serviceProps } from '@/app/api/types';

export async function getClients(): Promise<clientProps> {
  const response = await fetch('/api/login-client', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  return data;
}

export async function fetchHistoricoAgendamento(userId: string | null) {
  console.log('id do usuario', userId);

  const res = await fetch(`/api/getAgendamentos/${userId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Erro ao carregar agendamentos');
  }
  console.log('Agendamentos do cliente:', data);
  return data;
}

export async function useAGetService() {
  const response = await fetch('api/service', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();
  console.log('Serviços do barbeiro', data);
  return data;
}
export function useServiceHook() {
  const { data: services = [], isLoading: servicesLoading } = useQuery<serviceProps[]>({
    queryKey: ['services'],
    queryFn: useAGetService,
  });
  return { services, servicesLoading };
}

export function useClientHook() {
  const {
    data: clients,
    isLoading,
    error,
  } = useQuery<clientProps>({
    queryKey: ['clients'],
    queryFn: getClients,
    staleTime: 1000 * 60 * 15, // 3. DICA: Evita requisições repetidas ao mudar de página
  });
  return { clients, isLoading, error };
}

export function useAgendamentosHoook() {
  const { clients } = useClientHook();
  const { data: agendamentos, isLoading: loading } = useQuery<IQueueEntryWithServices[]>({
    queryKey: ['agendamentos', clients?.id],
    queryFn: () => fetchHistoricoAgendamento(clients?.id ? String(clients.id) : null),
    enabled: !!clients?.id,
  });
  return { agendamentos, loading };
}
