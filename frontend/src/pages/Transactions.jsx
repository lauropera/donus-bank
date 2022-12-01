import Header from '../components/Header';

function Transactions() {
  return (
    <div className='font-body'>
      <Header />
      <main
        className='flex flex-col mt-14 h-[calc(100vh-3.5rem)]
        items-center gap-14 bg-slate-200'
      >
        <div
          className='w-full max-w-xs mt-4 sm:max-w-sm
          bg-slate-50 rounded p-5 h-20'
        ></div>
        <div
          className='w-full max-w-xs sm:max-w-sm
        bg-slate-50 rounded p-5 h-80'
        ></div>
      </main>
    </div>
  );
}

export default Transactions;
