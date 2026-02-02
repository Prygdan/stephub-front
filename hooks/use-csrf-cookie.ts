'use client';

import { http } from "@/services/instance";

declare global {
  interface Window {
    __csrfLoaded?: boolean;
  }
}

export const secureRequest = async <T>(callback: () => Promise<T>): Promise<T> => {
  if (!window.__csrfLoaded) {
    try {
      await http.get('/sanctum/csrf-cookie');
      window.__csrfLoaded = true;
    } catch (err) {
      console.log('Failed to load CSRF cookie');
    }
  }

  return callback();
};

