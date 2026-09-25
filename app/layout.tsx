import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ServiceWorkerRegistration from '../app/components/ServiceWorkerRegistration';

import './globals.css';

import QueryProvider from './providers/QueryProvider';

export const metadata: Metadata = {
  title: 'Fabinho barbearia clientes',
  description: 'Aplicativo da Barbearia Fabinho para clientes',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className="translated-ltr"
      //className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ServiceWorkerRegistration />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
