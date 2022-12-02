import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/tokenStorage';

const BAD_REQUEST_STATUS = 400;

function useLogoutVerify(errorStatus) {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getToken();

    if (!userId || errorStatus === BAD_REQUEST_STATUS) {
      removeToken();
      navigate('/');
    }
  }, [errorStatus]);
}

export default useLogoutVerify;
