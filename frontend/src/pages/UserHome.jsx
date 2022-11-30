import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiWallet3Fill } from 'react-icons/ri';
import { MdAttachMoney } from 'react-icons/md';
import { BiPlus } from 'react-icons/bi';
import { FiSend } from 'react-icons/fi';
import { useApi } from '../hooks/useApi';
import ActionButton from '../components/ActionButton';
import AuthContext from '../context/AuthProvider';
import Header from '../components/Header';

function UserHome() {
  const { setAuth } = useContext(AuthContext);
  const { data, isFetching, errorStatus } = useApi('/auth/me');
  const navigate = useNavigate();

  useEffect(() => {
    const UNAUTHORIZED_STATUS_CODE = 401;
    if (errorStatus === UNAUTHORIZED_STATUS_CODE) {
      const EMPTY_TOKEN = '';
      setAuth(EMPTY_TOKEN);
      localStorage.removeItem('token');
      return navigate('/');
    }
  }, [errorStatus]);

  return (
    <div className='font-body'>
      <Header logoutUser={setAuth} />
      <main className='flex h-screen bg-slate-200'>
        <section
          className={`w-full m-auto max-w-xs
        sm:max-w-sm bg-slate-50 rounded p-5 h-80`}
        >
          <div className='h-full flex flex-col'>
            <div>
              <p className='text-xl font-semibold mb-3 text-slate-800'>Conta</p>
              <div className='flex items-center gap-2'>
                <RiWallet3Fill size={40} className='text-emerald-700' />
                <p className='text-2xl font-bold text-slate-900'>
                  {!isFetching && `R$${data?.account?.balance || '0,00'}`}
                </p>
              </div>
            </div>

            <hr className='mt-5' />

            <div className='flex justify-between h-full items-center'>
              <ActionButton
                color='bg-amber-500'
                icon={
                  <MdAttachMoney alt='Icone de dinheiro' className='h-6 w-6' />
                }
                text='Histórico'
              />

              <ActionButton
                color='bg-emerald-700'
                icon={
                  <BiPlus alt='Icone de sinal de mais' className='h-6 w-6' />
                }
                text='Depositar'
              />

              <ActionButton
                color='bg-cyan-600'
                icon={<FiSend alt='Icone de envio' className='h-6 w-6' />}
                text='Enviar'
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserHome;
