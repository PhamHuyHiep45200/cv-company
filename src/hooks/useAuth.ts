import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const useAuth = () => {
  const { data: user, loading, error } = useSelector((state: RootState) => state.user);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
}; 