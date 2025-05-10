'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface WithAuthProps {
  allowedRoles?: string[];
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { allowedRoles }: WithAuthProps = {}
) {
  return function WithAuthComponent(props: P) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.push('/login');
        } else if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
          router.push('/unauthorized');
        }
      }
    }, [loading, isAuthenticated, user?.role, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(user?.role || ''))) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 