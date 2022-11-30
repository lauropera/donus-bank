import { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import donusLogo from '../assets/logo.png';
import FormInput from '../components/FormInput';
import { requestSignUp } from '../services/requests';
import SignedUpModal from '../components/SignedUpModal';

const CPF_REGEXP = /[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}/;

const signUpSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'No mínimo 3 caracteres')
    .max(14, 'Máximo 14 caracteres')
    .required('O nome é obrigatório'),
  lastName: yup
    .string()
    .min(3, 'No mínimo 3 caracteres')
    .required('O sobrenome é obrigatório'),
  cpf: yup
    .string()
    .matches(CPF_REGEXP, 'CPF inválido')
    .required('O CPF é obrigatório'),
  email: yup.string().email('Email inválido').required('O email é obrigatório'),
  password: yup.string().min(4, 'No mínimo 4 caracteres').required(),
});

function SignUp() {
  const navigate = useNavigate();
  const [signUpErrorMsg, setSignUpErrorMsg] = useState('');
  const [signedUp, setSignedUp] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const cpfMask = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCpf = (cpf) => cpf.replace(/[^0-9,]*/g, '').replace(',', '.');

  const redirectToLogin = () => {
    const TWO_SECONDS = 2000;
    setSignedUp(true);
    setTimeout(() => {
      navigate('/');
    }, TWO_SECONDS);
  };

  const onSubmit = async ({ name, lastName, cpf, email, password }) => {
    try {
      const user = {
        name: `${name} ${lastName}`,
        cpf: formatCpf(cpf),
        email,
        password,
      };
      await requestSignUp(user);
      redirectToLogin();
    } catch (error) {
      setSignUpErrorMsg(error.response.data.message);
      console.error(error.message);
    }
  };

  return (
    <div className='font-body'>
      <main className='flex min-h-screen bg-emerald-600'>
        <SignedUpModal visible={signedUp} />
        <div className='w-full max-w-xs sm:max-w-sm m-auto bg-slate-100 rounded p-5'>
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
              handleChange={(event) => {
                const { value } = event.target;
                event.target.value = cpfMask(value);
              }}
              registerInput={{
                ...register('cpf', {
                  onChange: (event) => {
                    const { value } = event.target;
                    event.target.value = cpfMask(value);
                  },
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
                className={`w-full border-2 text-emerald-600 border-emerald-600
                hover:bg-emerald-900 hover:border-emerald-900
                hover:text-white text-sm font-bold py-2 px-4 mb-6
                rounded transition-all`}
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
