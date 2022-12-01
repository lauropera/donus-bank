import React from 'react';
import { IoMdExit } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import donusLogoAlt from '../assets/logo_alt.png';
import { removeToken } from '../utils/tokenStorage';

function Header() {
  const navigate = useNavigate();

  const logout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <header
      className={`bg-emerald-600 h-14 w-screen justify-between
    flex items-center fixed drop-shadow px-7`}
    >
      <div className='flex items-center h-full'>
        <div>
          <img
            className='w-10 mx-auto mt-px'
            alt='Donus Logo'
            src={donusLogoAlt}
          />
        </div>
        <h1 className='font-bold text-white text-xl pl-1'>Donus Bank</h1>
      </div>
      <div className='flex gap-1 items-center text-white  p-1'>
        <button
          className='flex gap-1'
          id='logout'
          type='button'
          onClick={logout}
        >
          <IoMdExit className='h-6 w-6' />
          Sair
        </button>
      </div>
    </header>
  );
}

export default Header;
