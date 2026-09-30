export const formatarData = (dataISO: Date | string) => {
  if (!dataISO) return '';

  // Se já for uma string formatada (ex: "30/09/2026, 18:00"), retorna direto
  if (typeof dataISO === 'string' && dataISO.includes('/')) {
    return dataISO;
  }

  let data: Date;

  if (typeof dataISO === 'string') {
    // Se a string contiver 'T' ou 'Z' (ISO do tipo "2026-09-30T14:00:00.000Z"),
    // removemos a indicação UTC ('Z') e o 'T' para forçar o browser a ler como HORA LOCAL.
    const stringSemUTC = dataISO.replace('Z', '').replace('T', ' ');
    data = new Date(stringSemUTC);
  } else {
    data = dataISO;
  }

  // Validação para datas inválidas
  if (isNaN(data.getTime())) {
    return String(dataISO);
  }

  // Não passe o parâmetro 'timeZone' aqui para não forçar uma nova conversão
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
