import axios from 'axios';
import { useEffect, useState } from 'react';

export function useApi(url) {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .finally(() => setIsFetching(false));
  }, []);

  return { data, isFetching };
}
