import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiWallet3Fill } from 'react-icons/ri';
import { MdAttachMoney } from 'react-icons/md';
import { BiPlus } from 'react-icons/bi';
import { FiSend } from 'react-icons/fi';
import { useApi } from '../hooks/useApi';
import ActionButton from '../components/ActionButton';
import AuthContext from '../context/AuthProvider';
import Header from '../components/Header';
import { getToken, removeToken } from '../utils/tokenStorage';
import DepositModal from '../components/DepositModal';

const BAD_REQUEST_STATUS = 400;

function UserHome() {
  const { setAuth } = useContext(AuthContext);
  const [showModal, setShowModal] = useState({
    deposit: false,
    transfer: false,
  });
  const { data, isFetching, errorStatus, setRefresh } = useApi('/auth/me');
  const navigate = useNavigate();

  const handleOnOpen = (type) => setShowModal({ ...showModal, [type]: true });
  const handleOnClose = (type) => setShowModal({ ...showModal, [type]: false });

  useEffect(() => {
    if (!getToken() || BAD_REQUEST_STATUS === errorStatus) {
      const EMPTY_TOKEN = '';
      setAuth(EMPTY_TOKEN);
      removeToken();
      return navigate('/');
    }
  }, [errorStatus]);

  return (
    <div className='font-body'>
      <Header logoutUser={setAuth} />

      <main className='flex h-screen bg-slate-200'>
        <section
          className={`w-full m-auto max-w-xs
        sm:max-w-sm bg-slate-50 rounded p-5 h-96`}
        >
          <div className='h-full flex flex-col'>
            <div>
              <h1 className='text-2xl font-bold text-slate-900'>
                {`Olá, ${!isFetching ? data?.name?.split(' ')[0] : ''}`}
              </h1>
            </div>

            <hr className='mt-5 mb-5' />

            <div>
              <p className='text-xl font-semibold mb-3 text-slate-800'>Conta</p>
              <div className='flex items-center gap-2'>
                <RiWallet3Fill size={40} className='text-emerald-700' />
                <p className='text-2xl font-bold text-slate-900'>
                  {!isFetching && `R$${data?.account?.balance || '0.00'}`}
                </p>
              </div>
            </div>

            <hr className='mt-5' />

            <div className='flex justify-between h-full items-center'>
              <ActionButton
                text='Histórico'
                color='bg-amber-500'
                icon={
                  <MdAttachMoney alt='Icone de dinheiro' className='h-6 w-6' />
                }
                handleClick={() => navigate('/transactions')}
              />

              <DepositModal
                text='Depósito'
                visible={showModal.deposit}
                refreshBalance={() => setRefresh(true)}
                onClose={() => handleOnClose('deposit')}
              />

              <ActionButton
                text='Depositar'
                color='bg-emerald-700'
                icon={
                  <BiPlus alt='Icone de sinal de mais' className='h-6 w-6' />
                }
                handleClick={() => handleOnOpen('deposit')}
              />

              <ActionButton
                text='Enviar'
                color='bg-cyan-600'
                icon={<FiSend alt='Icone de envio' className='h-6 w-6' />}
                handleClick={() => handleOnOpen('transfer')}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserHome;
