export async function Agend() {
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
