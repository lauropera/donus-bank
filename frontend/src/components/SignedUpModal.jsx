import React from 'react';
import { FcCheckmark } from 'react-icons/fc';
import { bool } from 'prop-types';

function SignedUpModal({ visible }) {
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-30
      backdrop-blur-sm flex justify-center items-center`}
    >
      <div
        className={`bg-slate-200 p-4 rounded
        h-50 flex justify-evenly items-center flex-col gap-1`}
      >
        <FcCheckmark size={80} />
        <h1 className='mb-2 font-medium'>Usuário cadastrado com sucesso!</h1>
        <p className='text-sm font-medium'>Redirecionando...</p>
      </div>
    </div>
  );
}

SignedUpModal.propTypes = {
  visible: bool.isRequired,
};

export default SignedUpModal;
