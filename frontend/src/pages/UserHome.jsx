import { useEffect, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { RiWallet3Fill } from 'react-icons/ri';
import { MdAttachMoney } from 'react-icons/md';
import { getToken, removeToken } from '../utils/tokenStorage';
import Modal from '../components/Modal';
import Header from '../components/Header';
import DepositForm from '../components/DepositForm';
import ActionButton from '../components/ActionButton';
import TransactionForm from '../components/TransactionForm';
import requests from '../services/requests';

const BAD_REQUEST_STATUS = 400;

function UserHome() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [errorStatus, setErrorStatus] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showModal, setShowModal] = useState({
    deposit: false,
    transfer: false,
  });

  const handleModal = (type) => {
    setShowModal({ ...showModal, [type]: !showModal[type] });
  };

  const getData = async () => {
    try {
      const userData = await requests.get.getUser();
      setData(userData);
    } catch (error) {
      setErrorStatus(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getData();

    if (!getToken() || errorStatus === BAD_REQUEST_STATUS) {
      removeToken();
      return navigate('/');
    }
  }, [errorStatus, refresh]);

  return (
    <div className='font-body'>
      <Header />
      <main className='flex h-screen bg-slate-200'>
        <section
          className='w-full m-auto max-w-xs
        sm:max-w-sm bg-slate-50 rounded p-5 h-96'
        >
          {!isFetching && (
            <div className='h-full flex flex-col'>
              <div>
                <h1 className='text-2xl font-bold text-slate-900'>
                  {`Olá, ${data?.name?.split(' ')[0] || ''}!`}
                </h1>
              </div>

              <hr className='mt-5 mb-5' />

              <div>
                <p
                  className='text-xl font-semibold mb-3
                text-slate-800 cursor-default'
                >
                  Conta
                </p>
                <div className='flex items-center gap-2'>
                  <RiWallet3Fill size={40} className='text-emerald-700' />
                  <p className='text-2xl font-bold text-slate-900'>
                    {`R$${String(data?.account?.balance).replace('.', ',')}`}
                  </p>
                </div>
              </div>

              <hr className='mt-5' />

              <div className='flex justify-between h-full items-center'>
                <ActionButton
                  text='Histórico'
                  color='bg-amber-500'
                  icon={
                    <MdAttachMoney
                      alt='Icone de dinheiro'
                      className='h-6 w-6'
                    />
                  }
                  handleClick={() => navigate('/transactions')}
                />

                <ActionButton
                  text='Depositar'
                  color='bg-emerald-700'
                  icon={
                    <BiPlus alt='Icone de sinal de mais' className='h-6 w-6' />
                  }
                  handleClick={() => handleModal('deposit')}
                />
                <Modal
                  headerText='Depósito'
                  handleModal={() => handleModal('deposit')}
                  visible={showModal.deposit}
                  form={
                    <DepositForm
                      handleModal={() => handleModal('deposit')}
                      refreshBalance={() => setRefresh(!refresh)}
                    />
                  }
                />

                <ActionButton
                  text='Enviar'
                  color='bg-cyan-600'
                  icon={<FiSend alt='Icone de envio' className='h-6 w-6' />}
                  handleClick={() => handleModal('transfer')}
                />
                <Modal
                  headerText='Transferencia'
                  handleModal={() => handleModal('transfer')}
                  visible={showModal.transfer}
                  form={
                    <TransactionForm
                      handleModal={() => handleModal('transfer')}
                      refreshBalance={() => setRefresh(!refresh)}
                    />
                  }
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserHome;
