"use client"

import { FieldValues, RegisterOptions, UseFormRegister, Path } from "react-hook-form";

interface InputProps<T extends FieldValues>{
    placeholder: string;
    type: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    error?: string;
    rules?: RegisterOptions<T, Path<T>>;
   // onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;


   

}
export function Input<T extends FieldValues>({placeholder, type, name, register, error, rules}: InputProps<T>){
    return(
        <>
        <input
        className="w-full border text-lg text-gray-600 rounded-md h-11 mb-3 p-2 max-sm:text-sm"
        placeholder={placeholder}
        type={type}   
       // onChange={onChange}    
        {...register(name, rules)}
        id={name}
        />
        {error && <span className="text-red-500 my-1">{error}</span>}
        </>
    )
}