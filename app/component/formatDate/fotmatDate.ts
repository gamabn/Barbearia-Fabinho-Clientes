export const formatarData = (dataISO: Date | string) => {
  if (!dataISO) return '';

  const data = new Date(dataISO);

  // Se por acaso vier uma string já formatada, devolve direto
  if (isNaN(data.getTime())) {
    return String(dataISO);
  }

  // O toLocaleString vai converter automaticamente de UTC para o fuso do usuário
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
