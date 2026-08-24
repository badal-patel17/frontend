// src/hooks/useApi.js
// Generic hook for calling any async API function.
//
// Usage (fetch-once on mount):
//   const { data, loading, error, refetch } = useApi(fetchOrders);
//
// Usage (reactive params — call refetch when params change):
//   const { data, refetch } = useApi(fetchOrders, {}, { immediate: false });
//   useEffect(() => { refetch({ page, limit }); }, [page, limit]);
//
// NOTE: params passed as the second argument are captured by ref.
// Changing the params object identity does NOT re-trigger the fetch.
// Use refetch(newParams) for reactive behaviour.

import { useState, useEffect, useCallback, useRef } from 'react';

const useApi = (apiFn, params = {}, { immediate = true } = {}) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const execute = useCallback(async (overrideParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(overrideParams ?? paramsRef.current);
      setData(result.data ?? result);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute };
};

export default useApi;
