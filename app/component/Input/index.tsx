'use client';

import { FieldValues, RegisterOptions, UseFormRegister, Path } from 'react-hook-form';
import { formatPhone } from '../maskPhone';

interface InputProps<T extends FieldValues> {
  placeholder: string;
  type: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  rules?: RegisterOptions<T, Path<T>>;
  isPhone?: boolean;
}

export function Input<T extends FieldValues>({
  placeholder,
  type,
  name,
  register,
  error,
  rules,
  isPhone = false,
}: InputProps<T>) {
  const registered = register(name, rules);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPhone) {
      // ✅ Cria um novo valor formatado
      const formatted = formatPhone(event.target.value);

      // ✅ Atualiza o DOM de forma controlada pelo React
      //    (não muta event.target.value diretamente antes do RHF)
      event.target.value = formatted;
      console.log('📞 valor após máscara:', event.target.value);
    }

    // ✅ Chama o onChange do RHF DEPOIS de ajustar o valor
    registered.onChange(event);
  };

  return (
    <>
      <input
        {...registered}
        id={name}
        name={name}
        className="w-full border text-lg text-gray-600 rounded-md h-11 mb-3 p-2 max-sm:text-sm"
        placeholder={placeholder}
        type={type}
        maxLength={isPhone ? 15 : undefined}
        onChange={handlePhoneChange}
      />
      {error && <span className="text-red-500 my-1">{error}</span>}
    </>
  );
}
