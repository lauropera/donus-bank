import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import requests from '../services/requests';
import FormInput from './FormInput';
import Button from './Button';
import CancelButton from './CancelButton';
import { DepositSchema } from '../services/schemas';
import moneyFormat from '../utils/moneyFormat';

function DepositForm({ handleModal, refreshBalance }) {
  const [value, setValue] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(DepositSchema),
  });

  const handleChange = ({ target }) => {
    const amount = moneyFormat(target.value);
    const DECIMAL_REGEX = /^\d*([,.]{0,1}\d{0,2})$/;
    if (DECIMAL_REGEX.test(amount)) setValue(amount);
  };

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
        placeholder='0,00'
        errors={errors}
        inputValue={value}
        registerInput={{
          ...register('value', {
            onChange: (e) => handleChange(e),
          }),
        }}
      />

      <div className='flex gap-3'>
        <Button type='submit' text='Confirmar' />
        <CancelButton handleModal={handleModal} />
      </div>
    </form>
  );
}

export default DepositForm;
