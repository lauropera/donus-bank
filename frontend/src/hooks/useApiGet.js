import { useEffect, useState } from 'react';
import { getToken } from '../utils/tokenStorage';
import requests, { setTokenHeaders } from '../services/requests';

function useApiGet(request) {
  const [data, setData] = useState([]);
  const [errorStatus, setErrorStatus] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setTokenHeaders(getToken());
    requests.get[request]()
      .then((response) => setData(response))
      .catch((error) => setErrorStatus(error.response.status))
      .finally(() => setIsFetching(false));
  }, [refresh]);

  return { data, errorStatus, isFetching, refresh, setRefresh };
}

export default useApiGet;
