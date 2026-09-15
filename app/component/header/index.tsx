'use client';
import Image from 'next/image';

export function Header() {
  return (
    <div className="flex items-center justify-center bg-black text-white w-full h-[100px]">
      <h1 className="text-lg font-bold">Fabinho Barbearia</h1>
      <Image
        src="/icon-192.png"
        alt="Logo"
        width={60}
        height={60}
        loading="eager"
        className="mb-4 rounded-full flex m-2"
      />
    </div>
  );
}
