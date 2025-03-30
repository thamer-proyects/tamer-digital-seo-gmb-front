import { LoadingContext } from '@/store/loadingContext';
import { useContext } from 'react';

export const useLoading = () => {
  return useContext(LoadingContext);
};
