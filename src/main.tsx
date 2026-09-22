import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Register PWA Service Worker for offline capability & asset precaching in production
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('Konten baru tersedia, memperbarui cache PWA secara otomatis...');
    },
    onOfflineReady() {
      console.log('Aplikasi Presensi SMP NEGERI SATAP 4 PALASA siap digunakan dalam mode offline.');
    },
  });
}

// Safely catch benign browser unhandled promise rejections (e.g. Media/Audio autoplay interruptions, iframe navigation, Vite dev websocket)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason instanceof Error ? reason.message : String(reason || '');
    if (
      msg.includes('play()') ||
      msg.includes('user gesture') ||
      msg.includes('interrupted') ||
      msg.includes('media was removed') ||
      msg.includes('The play() request was interrupted') ||
      msg.includes('offline') ||
      msg.includes('failed to connect') ||
      msg.includes("reading 'send'") ||
      msg.includes('send')
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="Terjadi Kendala Memuat Aplikasi">
      <App />
    </ErrorBoundary>
  </StrictMode>
);

