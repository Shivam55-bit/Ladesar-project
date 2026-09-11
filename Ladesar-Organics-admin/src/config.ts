/// <reference types="vite/client" />

function getApiBase(): string {
  let envUrl = ((import.meta as any).env?.VITE_API_URL || '').trim();

  if (envUrl) {
    if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
      envUrl = `https://${envUrl}`;
    }
    return envUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // When running live on Render
    if (hostname.includes('onrender.com')) {
      return 'https://ladesar-backend.onrender.com';
    }
    // When running locally
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://127.0.0.1:5000';
    }
  }

  return '';
}

export const API_BASE = getApiBase();
