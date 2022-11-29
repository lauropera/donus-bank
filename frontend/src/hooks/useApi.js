import axios from 'axios';
import { useEffect, useState } from 'react';

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3001'
});

export function useApi(url) {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    api
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .finally(() => setIsFetching(false));
  }, []);

  return { data, isFetching };
}
