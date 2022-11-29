import React from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import donusLogo from '../../assets/logo.png';
import FormInput from '../../components/FormInput';

const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('O email é obrigatório'),
  password: yup
    .string()
    .min(4, 'A senha precisa ter no mínimo 4 caracteres')
    .required('A senha é obrigatória'),
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <main className='flex h-screen bg-emerald-600'>
        <div className='w-full max-w-xs m-auto bg-slate-100 rounded p-5'>
          <header>
            <img
              className='w-20 mx-auto mb-5'
              src={donusLogo}
              alt='Donus Logo'
            />
          </header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              labelText='Email'
              name='email'
              id='email'
              type='text'
              errors={errors}
              registerInput={{ ...register('email') }}
            />

            <FormInput
              labelText='Senha'
              name='password'
              id='password'
              type='password'
              errors={errors}
              registerInput={{ ...register('password') }}
            />

            <div>
              <button
                className={`w-full bg-emerald-600 hover:bg-emerald-900
                text-white font-bold py-2 px-4 mb-6 rounded transition-all`}
                type='submit'
              >
                Enviar
              </button>
            </div>
          </form>

          <footer>
            <button
              className={`w-full border-2 text-emerald-600 border-emerald-600
                hover:bg-emerald-900 hover:border-emerald-900
                hover:text-white text-sm font-bold py-2 px-4 mb-6
                rounded transition-all`}
              type='button'
            >
              Criar conta
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Login;
