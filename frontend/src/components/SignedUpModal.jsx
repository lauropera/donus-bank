import React from 'react';
import { FcCheckmark } from 'react-icons/fc';

function SignedUpModal({ visible }) {
  if (!visible) return null;

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-40
      flex justify-center items-center'
    >
      <div
        className='bg-slate-200 p-4 rounded w-80
        h-max flex justify-evenly items-center flex-col gap-1'
      >
        <FcCheckmark size={80} />
        <h1 className='mb-2 font-medium'>Usuário cadastrado com sucesso!</h1>
        <p className='text-sm font-medium'>Redirecionando...</p>
      </div>
    </div>
  );
}

export default SignedUpModal;
