import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import CancelButton from '../../components/CancelButton';
import requests from '../../services/requests';
import moneyFormat from '../../utils/moneyFormat';
import { maskCPFInput, formatCPF } from '../../utils/cpfUtils';
import { CPFSchema, EmailSchema, transactionSchema } from '../../services/schemas';

const isMethodEmail = (transferMethod) => {
  return transferMethod === 'email';
};

function TransactionForm({ handleModal, refreshBalance }) {
  const [method, setMethod] = useState('email');
  const [value, setValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      isMethodEmail(method)
        ? transactionSchema(EmailSchema)
        : transactionSchema(CPFSchema)
    ),
  });

  useEffect(() => {
    setErrorMsg('');
    reset({ email: '', cpf: '', value: '' });
  }, [method]);

  const handleChange = ({ target }) => {
    const amount = moneyFormat(target.value);
    const DECIMAL_REGEX = /^\d*([,.]{0,1}\d{0,2})$/;
    if (DECIMAL_REGEX.test(amount)) setValue(amount);
  };

  const onSubmit = async (data) => {
    if (data?.cpf) data = { ...data, cpf: formatCPF(data.cpf) };

    try {
      const transaction = { [method]: data[method], value: data.value };
      await requests.post.transaction(transaction, method);

      refreshBalance();
      setErrorMsg('');
      handleModal();
      reset({ email: '', cpf: '', value: '' });
    } catch (error) {
      setErrorMsg(error.response.data.message);
    }
  };

  return (
    <>
      <div className='flex gap-2 w-full'>
        <Button
          handleClick={() => setMethod('email')}
          type='button'
          text='Email'
          customStyle={`w-32 ${isMethodEmail(method) ? 'bg-emerald-800' : ''}`}
        />
        <Button
          handleClick={() => setMethod('cpf')}
          type='button'
          text='CPF'
          customStyle={`w-32 ${isMethodEmail(method) ? '' : 'bg-emerald-800'}`}
        />
      </div>

      <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
        {isMethodEmail(method) ? (
          <FormInput
            labelText='Email'
            name='email'
            id='email'
            placeholder='pessoa@email.com'
            type='text'
            errors={errors}
            registerInput={{ ...register('email') }}
          />
        ) : (
          <FormInput
            labelText='CPF'
            name='cpf'
            id='cpf'
            placeholder='000.000.000-00'
            type='text'
            maxLength='14'
            errors={errors}
            registerInput={{
              ...register('cpf', {
                onChange: (event) => maskCPFInput(event),
              }),
            }}
          />
        )}

        <FormInput
          labelText='Insira o valor'
          name='value'
          id='value'
          type='text'
          placeholder='0,00'
          inputValue={value}
          errors={errors}
          registerInput={{
            ...register('value', {
              onChange: (e) => handleChange(e),
            }),
          }}
        />

        <div>
          <div className='flex gap-3'>
            <Button type='submit' text='Confirmar' />
            <CancelButton
              handleModal={() => {
                handleModal();
                setErrorMsg('');
              }}
            />
          </div>
          {errorMsg && (
            <p className='mb-3 w-64 text-center text-red-600'>{errorMsg}</p>
          )}
        </div>
      </form>
    </>
  );
}

export default TransactionForm;
