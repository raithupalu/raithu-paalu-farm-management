import { useState, useCallback, useEffect } from 'react';

/**
 * Generic data fetching hook with re-fetch capability
 * Ensures fresh data is always fetched from backend
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, deps);

  return { data, loading, error, refetch };
}

/**
 * Hook for fetching data that can be manually triggered
 */
export function useManualFetch<T>(
  fetchFn: () => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  return { data, loading, error, refetch };
}

/**
 * Hook for CRUD operations that auto-refetches after mutations
 */
export function useCRUD<T>(
  fetchFn: () => Promise<T>
) {
  const { data, loading, error, refetch } = useManualFetch(fetchFn);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [mutationError, setMutationError] = useState<Error | null>(null);

  const executeMutation = useCallback(async (
    mutationFn: () => Promise<any>
  ): Promise<boolean> => {
    try {
      setMutationLoading(true);
      setMutationError(null);
      await mutationFn();
      // Always refetch after mutation to ensure fresh data
      await refetch();
      return true;
    } catch (err) {
      setMutationError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setMutationLoading(false);
    }
  }, [refetch]);

  return {
    data,
    loading: loading || mutationLoading,
    error: error || mutationError,
    refetch,
    executeMutation
  };
}
