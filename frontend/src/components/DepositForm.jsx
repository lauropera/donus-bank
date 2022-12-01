import React from 'react';
import * as yup from 'yup';
import { func } from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import requests from '../services/requests';
import FormInput from './FormInput';
import Button from './Button';
import CancelButton from './CancelButton';

const DepositSchema = yup.object().shape({
  value: yup
    .number()
    .min(0.01, 'O valor mínimo é de R$0,01')
    .max(2000, 'O valor máximo é de R$2000,00')
    .required('O valor é obrigatório')
    .typeError('O valor precisa ser um número'),
});

function DepositForm({ handleModal, refreshBalance }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(DepositSchema),
  });

  const onSubmit = async (values) => {
    await requests.patch.deposit(values);

    refreshBalance();
    handleModal();
    reset({ value: 0 });
  };

  return (
    <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        labelText='Insira o valor'
        name='value'
        id='value'
        type='text'
        errors={errors}
        registerInput={{ ...register('value') }}
      />

      <div className='flex gap-3'>
        <Button type='submit' text='Confirmar' />
        <CancelButton handleModal={handleModal} />
      </div>
    </form>
  );
}

DepositForm.propTypes = {
  handleModal: func.isRequired,
  refreshBalance: func.isRequired,
}

export default DepositForm;
