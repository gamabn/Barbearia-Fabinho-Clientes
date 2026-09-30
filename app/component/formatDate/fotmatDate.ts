// src/utils/date.ts
export const formatarData = (dataISO: Date | string) => {
  const data = new Date(dataISO);

  // Se por acaso vier string tipo "30/09/2026, 18:00" (já formatada), devolve direto
  if (isNaN(data.getTime())) {
    return String(dataISO);
  }

  return data.toLocaleString('pt-BR', {
    timeZone: 'America/Bahia', // 👈 mude de Sao_Paulo pra Bahia
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
