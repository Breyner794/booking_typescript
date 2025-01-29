// _app.tsx (para TypeScript)
import '@/app/globals.css'; // Importa tu CSS global
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}