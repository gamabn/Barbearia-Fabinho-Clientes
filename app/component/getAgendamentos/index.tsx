export async function getAgendamentos(date: string): Promise<string[]> {
  const res = await fetch(`/api/appointments?date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch data');
  const data = await res.json();

  // Converte scheduledAt para "HH:mm" no fuso do Brasil
  return data.map((a: { scheduledAt: string }) =>
    new Date(a.scheduledAt).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    })
  );
}
