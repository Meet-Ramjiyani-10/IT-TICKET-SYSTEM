import { useState, useEffect, useCallback } from "react";

/**
 * Generic hook for fetching data from an API endpoint.
 * Returns { data, loading, error, refetch }.
 */
export function useFetch(apiFn, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) fetch();
  }, [immediate, fetch]);

  return { data, loading, error, refetch: fetch };
}
