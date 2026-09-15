export async function getAgendamentos(date: string) {
  const res = await fetch(`/api/appointments?date=${date}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();
  // console.log( ' Todos osagendamentos')
  return data;
}
