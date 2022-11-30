import React from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiOutlineClose } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { requestDeposit } from '../services/requests';
import FormInput from './FormInput';
// import formatFloatNumber from '../utils/formatFloatNumber';

const depositSchema = yup.object().shape({
  balance: yup
    .number()
    .min(0.01, 'O valor mínimo é de R$0,01')
    .max(2000, 'O valor máximo é de R$2000,00')
    .required('O valor é obrigatório')
    .typeError('O valor precisa ser um número'),
});

function DepositModal({ text, visible, onClose, refreshBalance }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(depositSchema),
  });

  const onSubmit = async (values) => {
    await requestDeposit(values);
    refreshBalance();
    onClose();
  };

  // const formatNumber = (event) => {
  //   const { value } = event.target;
  //   console.log(value);
  //   const MIN = 0;
  //   const MAX = 2000;
  //   const decimalPlaces = value.split('.')[1];

  //   if (Number(value) < MIN) return (event.target.value = MIN);
  //   if (Number(value) > MAX) return (event.target.value = MAX);
  //   if (Number.isNaN(value)) return (event.target.value = 0);
  //   if (decimalPlaces && decimalPlaces.length >= 1) {
  //     return (event.target.value = formatFloatNumber(value));
  //   }
  //   console.log(parseFloat(value));
  //   return (event.target.value = String(parseFloat(value)));
  // };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-40
      flex justify-center items-center`}
    >
      <div
        className={`bg-slate-200 p-4 rounded
        h-50 flex justify-evenly items-center flex-col gap-1`}
      >
        <header className='w-full flex justify-between items-center'>
          <div>
            <h1
              className={`text-gray-800 font-lg font-bold
            tracking-normal leading-tight text-xl`}
            >
              {text}
            </h1>
          </div>

          <button type='button' className='mb-12' onClick={onClose}>
            <AiOutlineClose size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            labelText='Insira o valor'
            name='balance'
            id='balance'
            type='number'
            errors={errors}
            registerInput={{
              ...register('balance', {
                // onChange: (event) => formatNumber(event),
                value: 0,
              }),
            }}
          />

          <div className='flex gap-3'>
            <button
              className={`w-full bg-emerald-600 hover:bg-emerald-800
                text-white font-bold py-2 px-4 mb-6 rounded transition-all`}
              type='submit'
            >
              {text === 'Depósito' ? 'Depositar' : 'Enviar'}
            </button>
            <button
              className={`w-full text-slate-800 border-2 border-slate-300
              bg-slate-200 hover:bg-slate-300 hover:border-slate-300
              font-bold py-2 px-4 mb-6 rounded transition-all`}
              type='button'
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DepositModal;
