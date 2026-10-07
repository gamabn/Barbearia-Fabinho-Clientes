'use client';
import { QRCodeCanvas } from 'qrcode.react';
import { Scissors } from 'lucide-react';

export default function QrCode() {
  return (
    <div className="min-h-screen w-full p-2 bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="flex gap-2">
        <h1 className="text-xl font-mediun mb-3">Fabinho Barbearia</h1>
        <span>
          <Scissors size={27} color="#00ff" />
        </span>
      </div>

      <p className="text-gray-300 mb-6 text-lg">Escaneie o código para instalar nosso sistema!</p>

      <div className="inline-block p-2 bg-white rounded-md">
        {' '}
        {/* Borda branca/clara ao redor do QR Code */}
        <QRCodeCanvas
          value={`https://barbearia-fabinho-clientes.vercel.app/`} // O valor que o QR code representa

          size={280} // Tamanho em pixels
          bgColor={'#FFFFFF'} // Fundo do QR Code (branco para melhor contraste)
          fgColor={'#3A2E20'} // Cor dos módulos do QR (um marrom escuro)
          level={'H'} // Nível de correção alto (bom para logos)
          includeMargin={true}
          imageSettings={{
            src: '/tesoura.svg', // Caminho para sua imagem na pasta public
            height: 60,
            width: 60,
            excavate: true, // Remove os módulos do QR Code sob a imagem
          }}
        />
      </div>
    </div>
  );
}
