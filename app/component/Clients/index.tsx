export async function getClients() {
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
