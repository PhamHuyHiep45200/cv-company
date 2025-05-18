'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchUserData } from '@/store/slices/userSlice';
import { usePathname, useRouter } from 'next/navigation';

export function AuthProvider({ children, token }: { children: React.ReactNode, token?: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Fetch user data once when the app initializes
    const initializeAuth = async () => {
      try {
        if (token) {
          // Only fetch user data if token exists
          await dispatch(fetchUserData()).unwrap();
          // Redirect logic for auth pages
          const authPages = ['/login', '/register', '/forgot-password'];
          if (authPages.includes(pathname)) {
            const res = await fetch('/api/auth/me', { credentials: 'include' });
            if (res.ok) {
              const user = await res.json();
              if (user.role === 'CANDIDATE') {
                router.replace('/');
              } else if (user.role === 'ADMIN' || user.role === 'EMPLOYEE') {
                router.replace('/admin');
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching initial user data:', error);
        // If there's an error fetching user data, clear token and redirect to login
      }
    };

    initializeAuth();
  }, [dispatch, token, pathname, router]);

  return <>{children}</>;
} 