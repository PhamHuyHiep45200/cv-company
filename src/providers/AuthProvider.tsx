'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchUserData } from '@/store/slices/userSlice';
import { getCookie, deleteCookie } from 'cookies-next';

export function AuthProvider({ children, token }: { children: React.ReactNode, token?: string }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch user data once when the app initializes
    const initializeAuth = async () => {
      try {
        if (token) {
        // Only fetch user data if token exists
        await dispatch(fetchUserData()).unwrap();
        }

      } catch (error) {
        console.error('Error fetching initial user data:', error);
        // If there's an error fetching user data, clear token and redirect to login
        deleteCookie('token');
        window.location.href = '/login';
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
} 