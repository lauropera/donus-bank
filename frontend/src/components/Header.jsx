import React from 'react';
import donusLogo from '../assets/logo.png';

function Header() {
  return (
    <header className='bg-slate-200 h-14 fixed'>
      <div className='w-screen flex items-center h-full px-2'>
        <div>
          <img className='w-10 mx-auto mt-px' alt='Donus Logo' src={donusLogo} />
        </div>
        <h1 className='font-bold text-emerald-600 text-xl pl-1'>Donus</h1>
      </div>
    </header>
  );
}

export default Header;
