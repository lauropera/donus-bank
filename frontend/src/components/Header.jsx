import React from 'react';
import { IoMdExit, IoMdArrowBack } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import donusLogoAlt from '../assets/logo_alt.png';
import { removeToken } from '../utils/tokenStorage';

function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <header
      className='bg-emerald-600 h-14 w-screen justify-between
    flex items-center fixed top-0 drop-shadow p-2 md:px-7'
    >
      {pathname === '/transactions' && (
        <div className='flex gap-1 items-center text-white p-1'>
          <button type='button' onClick={() => navigate('/user')}>
            <IoMdArrowBack size={30} />
          </button>
        </div>
      )}
      <div className='flex items-center h-full'>
        <div>
          <img
            className='w-10 mx-auto mt-px'
            alt='Donus Logo'
            src={donusLogoAlt}
          />
        </div>
        <h1
          className={`${
            pathname === '/transactions' ? 'hidden' : ''
          } sm:block font-bold text-white text-xl pl-1`}
        >
          Donus Bank
        </h1>
      </div>
      <div className='flex gap-1 items-center text-white  p-1'>
        <button
          className='flex flex-col sm:flex-row items-center'
          id='logout'
          type='button'
          onClick={logout}
        >
          <IoMdExit size={30} />
          Sair
        </button>
      </div>
    </header>
  );
}

export default Header;
