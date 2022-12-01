import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { bool, string, func, element } from 'prop-types';

function Modal({ visible, headerText, handleModal, form }) {
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-40
      flex justify-center items-center`}
    >
      <div
        className={`bg-slate-200 p-4 rounded w-80
        h-max flex justify-evenly items-center flex-col gap-1`}
      >
        <header className='w-11/12 flex justify-between items-center'>
          <div>
            <h1
              className={`text-gray-800 font-lg font-bold
            tracking-normal leading-tight text-xl`}
            >
              {headerText}
            </h1>
          </div>

          <button type='button' className='mb-12' onClick={handleModal}>
            <AiOutlineClose size={24} />
          </button>
        </header>

        <div className='w-11/12 flex flex-col items-center'>{form}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  visible: bool.isRequired,
  headerText: string.isRequired,
  handleModal: func.isRequired,
  form: element.isRequired,
};

export default Modal;
