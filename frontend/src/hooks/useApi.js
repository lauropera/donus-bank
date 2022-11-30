import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { setToken } from '../services/requests';
import { getToken } from '../utils/token';

export function useApi(url) {
  const [errorStatus, setErrorStatus] = useState(0);
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setToken(getToken());

    api
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setErrorStatus(error.response.status);
        console.error(error.message);
      })
      .finally(() => setIsFetching(false));
  }, []);

  return { data, isFetching, errorStatus };
}
