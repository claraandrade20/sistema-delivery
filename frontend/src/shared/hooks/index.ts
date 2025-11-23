// Hooks customizados para o sistema

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ErrorHandler, retryWithBackoff } from '@shared/utils/errorHandler';

/**
 * Hook para gerenciar estado de carregamento e erro de uma operação
 */
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [loading, setLoading] = useState(immediate);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      return response;
    } catch (err: any) {
      const appError = ErrorHandler.handle(err);
      setError(appError.message as unknown as E);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  return { execute, loading, data, error };
};

/**
 * Hook para fazer requisições com retry automático
 */
export const useFetch = <T>(
  url: string,
  options?: {
    method?: string;
    body?: any;
    retry?: number;
  }
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await retryWithBackoff(
        async () => {
          const response = await window.fetch(url, options);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        },
        options?.retry || 3
      );

      setData(result);
      return result;
    } catch (err: any) {
      const message = ErrorHandler.getUserMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { fetch, loading, data, error };
};

/**
 * Hook para operações que podem falhar e necessitam retry
 */
export const useMutation = <T, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    retry?: number;
    showToast?: boolean;
  }
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: V) => {
      setLoading(true);
      setError(null);

      try {
        const result = await retryWithBackoff(
          () => mutationFn(variables),
          options?.retry || 2
        );

        if (options?.onSuccess) {
          options.onSuccess(result);
        }

        if (options?.showToast) {
          toast.success('Operação realizada com sucesso!');
        }

        return result;
      } catch (err: any) {
        const appError = ErrorHandler.handle(err);
        setError(appError);

        if (options?.onError) {
          options.onError(appError);
        }

        if (options?.showToast) {
          toast.error(ErrorHandler.formatMessage(appError));
        }

        throw appError;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, options]
  );

  return { mutate, loading, error };
};

/**
 * Hook para gerenciar lista com paginação
 */
export const usePagination = <T>(items: T[], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Hook para gerenciar filtro de lista
 */
export const useFilter = <T>(items: T[], filterFn: (item: T, query: string) => boolean) => {
  const [query, setQuery] = useState('');

  const filtered = query ? items.filter(item => filterFn(item, query)) : items;

  return {
    query,
    setQuery,
    filtered,
    hasResults: filtered.length > 0,
  };
};

/**
 * Hook para gerenciar estado de modal
 */
export const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
};

/**
 * Hook para gerenciar formulário com validação
 */
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>,
  validate?: (values: T) => Record<string, string>
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (validate) {
        const newErrors = validate(values);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
          return;
        }
      }

      try {
        setLoading(true);
        await onSubmit(values);
      } catch (error: any) {
        const message = ErrorHandler.getUserMessage(error);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [values, validate, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  return {
    values,
    errors,
    touched,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
  };
};

/**
 * Hook para debounce de valor
 */
export const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para localStorage
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};

/**
 * Hook para detectar mudanças online/offline
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

import React from 'react';
