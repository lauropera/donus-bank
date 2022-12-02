function CancelButton({ handleModal }) {
  return (
    <button
      className='w-full text-slate-800 border-2 border-slate-300
    bg-slate-200 hover:bg-slate-300 hover:border-slate-300
    font-bold py-2 px-4 mb-6 rounded transition-all'
      type='button'
      onClick={handleModal}
    >
      Cancelar
    </button>
  );
}

export default CancelButton;
