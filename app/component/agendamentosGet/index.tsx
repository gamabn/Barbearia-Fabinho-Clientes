import { ObjectId } from 'mongodb';

export async function fetchHistoricoAgendamento(userId: string | null | ObjectId) {
  console.log('id do usuario', userId);
  try {
    const res = await fetch(`/api/getAgendamentos/${userId}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Erro ao carregar agendamentos');
    }
    console.log('Agendamentos do cliente:', data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
