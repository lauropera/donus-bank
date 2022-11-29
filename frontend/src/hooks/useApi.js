import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

export function useApi(method, url, body = {}) {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    api
      [method](url, body)
      .then((response) => {
        setData(response.data);
      })
      .finally(() => setIsFetching(false));
  }, []);

  return { data, isFetching };
}
