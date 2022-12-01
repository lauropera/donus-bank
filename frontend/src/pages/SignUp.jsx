import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import donusLogo from '../assets/logo.png';
import requests from '../services/requests';
import { maskCPFInput, formatCPF } from '../utils/cpfUtils';
import FormInput from '../components/FormInput';
import SignedUpModal from '../components/SignedUpModal';
import { SignUpSchema } from '../services/schemas';

function SignUp() {
  const navigate = useNavigate();
  const [signUpErrorMsg, setSignUpErrorMsg] = useState('');
  const [signedUp, setSignedUp] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignUpSchema),
  });

  const redirectToLogin = () => {
    const THREE_SECONDS = 3000;
    setSignedUp(true);
    setTimeout(() => {
      navigate('/');
    }, THREE_SECONDS);
  };

  const onSubmit = async ({ name, lastName, cpf, email, password }) => {
    try {
      const user = {
        name: `${name} ${lastName}`,
        cpf: formatCPF(cpf),
        email,
        password,
      };
      await requests.post.signUp(user);
      redirectToLogin();
    } catch (error) {
      setSignUpErrorMsg(error.response.data.message);
    }
  };

  return (
    <div className='font-body'>
      <main className='flex min-h-screen bg-emerald-600'>
        <SignedUpModal visible={signedUp} />

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
            <div className='flex gap-3'>
              <FormInput
                labelText='Nome'
                name='name'
                id='name'
                type='text'
                errors={errors}
                registerInput={{ ...register('name') }}
              />

              <FormInput
                labelText='Sobrenome'
                name='lastName'
                id='lastName'
                type='text'
                errors={errors}
                registerInput={{ ...register('lastName') }}
              />
            </div>

            <FormInput
              labelText='CPF'
              name='cpf'
              id='cpf'
              type='text'
              errors={errors}
              registerInput={{
                ...register('cpf', {
                  onChange: (event) => maskCPFInput(event),
                }),
              }}
            />

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
                className='w-full border-2 text-emerald-600 border-emerald-600
                hover:bg-emerald-900 hover:border-emerald-900
                hover:text-white text-sm font-bold py-2 px-4 mb-6
                rounded transition-all'
                type='submit'
              >
                Cadastrar
              </button>

              {signUpErrorMsg && (
                <p className='mb-3 text-red-600'>{signUpErrorMsg}</p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SignUp;
