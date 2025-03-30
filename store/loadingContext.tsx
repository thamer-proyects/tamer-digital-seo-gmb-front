'use client';
import Loader from '@/components/ui/loader';
import { createContext, useMemo, useState } from 'react';

interface LoadingContextValue {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  percentage: number;
  setPercentage: (percentage: number) => void;
  message: string;
  setMessage: (message: string) => void;
}

export const LoadingContext = createContext<LoadingContextValue>({} as LoadingContextValue);

interface Props {
  children: React.ReactNode;
}

const LoadingContextProvider: React.FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [message, setMessage] = useState('Loading...');

  const setLoading = (value: boolean) => {
    setIsLoading(value);
  };

  const setPercentageValue = (value: number) => {
    setPercentage(value);
  };

  const setMessageValue = (value: string) => {
    setMessage(value);
  };

  const value: LoadingContextValue = useMemo(
    () => ({
      isLoading,
      setLoading,
      percentage,
      setPercentage: setPercentageValue,
      message,
      setMessage: setMessageValue,
    }),
    [isLoading, percentage, message],
  );

  return (
    <LoadingContext.Provider value={value}>
      {isLoading ? <Loader percentage={percentage} message={message} /> : children}
    </LoadingContext.Provider>
  );
};

export default LoadingContextProvider;
