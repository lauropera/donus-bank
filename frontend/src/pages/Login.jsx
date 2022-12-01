import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import donusLogo from '../assets/logo.png';
import { getToken } from '../utils/tokenStorage';
import requests, { setTokenHeaders } from '../services/requests';
import FormInput from '../components/FormInput';
import { LoginSchema } from '../services/schemas';

function Login() {
  const navigate = useNavigate();
  const [loginFail, setLoginFail] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  useEffect(() => {
    if (getToken()) navigate('/user');
  }, []);

  const onSubmit = async (values) => {
    try {
      const { token } = await requests.post.login(values);
      localStorage.setItem('donus-bank:auth-token', token);
      setTokenHeaders(token);
      navigate('/user');
    } catch (error) {
      setLoginFail(true);
    }
  };

  return (
    <div className='font-body'>
      <main className='flex h-screen bg-emerald-600'>
        <div
          className='w-full max-w-xs sm:max-w-sm
          m-auto bg-slate-100 rounded p-5'
        >
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
                className='w-full bg-emerald-600 hover:bg-emerald-900
                text-white font-bold py-2 px-4 mb-6 rounded transition-all'
                type='submit'
              >
                Entrar
              </button>
              {loginFail && (
                <p className='mb-3 text-red-600'>Email ou senha incorretos</p>
              )}
            </div>
          </form>

          <footer>
            <button
              className='w-full border-2 text-emerald-600 border-emerald-600
                hover:bg-emerald-900 hover:border-emerald-900
                hover:text-white text-sm font-bold py-2 px-4 mb-6
                rounded transition-all'
              type='button'
              onClick={() => navigate('/register')}
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
