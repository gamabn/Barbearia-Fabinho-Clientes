export const formatPhone = (value: string) => {
  if (!value) return '';

  // Remove tudo que não for dígito
  const digits = value.replace(/\D/g, '');

  // Limita a no máximo 11 dígitos
  const limitedDigits = digits.slice(0, 11);

  // Aplica a formatação incremental
  return limitedDigits.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};
