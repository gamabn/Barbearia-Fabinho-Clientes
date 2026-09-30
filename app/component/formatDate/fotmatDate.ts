export const formatarData = (dataISO: Date | string) => {
  if (!dataISO) return '';

  let data: Date;

  if (typeof dataISO === 'string') {
    //   // Substitui 'T' por ' ' para o JS interpretar como hora local do dispositivo,
    // ou mantém se já for outro formato.
    const dataTratada =
      dataISO.includes('T') && !dataISO.endsWith('Z') ? dataISO.replace('T', ' ') : dataISO;

    data = new Date(dataTratada);
  } else {
    data = dataISO;
  }

  // Se vier uma string inválida ou já formatada, devolve direto
  if (isNaN(data.getTime())) {
    return String(dataISO);
  }

  return data.toLocaleString('pt-BR', {
    timeZone: 'America/Bahia',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
