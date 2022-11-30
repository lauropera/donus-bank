import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { setTokenHeaders } from '../services/requests';
import { getToken } from '../utils/tokenStorage';

export function useApi(url) {
  const [errorStatus, setErrorStatus] = useState(0);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setTokenHeaders(getToken());

    api
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setErrorStatus(error.response.status);
        console.error(error.message);
      })
      .finally(() => {
        setIsFetching(false);
        setRefresh(false);
      });
  }, [refresh]);

  return { data, isFetching, errorStatus, setRefresh };
}
