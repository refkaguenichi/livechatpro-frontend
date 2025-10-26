"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const fetchGoogleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
          await api.post('/user/google/callback', { token },{withCredentials:true}); // Example endpoint for Google callback
          router.push('/'); // Redirect to home
        } else {
          router.push('/login'); // Redirect to login if no token
        }
      } catch (error) {
        console.error('Google authentication failed', error);
        router.push('/login'); // Redirect to login on failure
      }
    };

    fetchGoogleAuth();
  }, [router]);

  return <p>Processing...</p>;
}