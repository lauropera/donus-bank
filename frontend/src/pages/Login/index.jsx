import React from 'react';
import { useForm } from 'react-hook-form';
import donusLogo from '../../assets/logo.png';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
            <div>
              <label
                className='block mb-2 font-medium text-slate-900'
                htmlFor='email'
              >
                Email
              </label>
              <input
                className={`w-full p-2 mb-6 text-slate-900 border-b-2
                border-emerald-600 outline-none focus:bg-gray-300 transition-all`}
                type='text'
                name='email'
                id='email'
                {...register('email')}
              />
            </div>

            <div>
              <label
                className='block mb-2 font-medium text-slate-900'
                htmlFor='password'
              >
                Senha
              </label>
              <input
                className={`w-full p-2 mb-6 text-slate-900 border-b-2
                border-emerald-600 outline-none focus:bg-gray-300 transition-all`}
                type='password'
                name='password'
                id='password'
                {...register('password')}
              />
            </div>

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
                hover:text-white text-sm font-bold py-2 px-4 mb-6 rounded transition-all`}
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
