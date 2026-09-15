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
  isPhone?: boolean; // Prop para ativar a máscara apenas quando necessário
  // onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input<T extends FieldValues>({
  placeholder,
  type,
  name,
  register,
  error,
  rules,
  isPhone = false, // Prop para ativar a máscara apenas quando necessário
}: InputProps<T>) {
  const registered = register(name, rules);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPhone) {
      event.target.value = formatPhone(event.target.value);
    }

    // Chama o onChange nativo do react-hook-form para atualizar o estado do formulário
    registered.onChange(event);
  };
  return (
    <>
      <input
        {...registered}
        id={name}
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
