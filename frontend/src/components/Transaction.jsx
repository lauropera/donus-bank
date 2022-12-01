import { useEffect, useState } from 'react';

function Transaction({
  userId,
  created,
  owner,
  receiver,
  transactionType,
  value,
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    setDisplayName();
  }, []);

  const setDisplayName = () => {
    if (transactionType === 'Depósito') return setName('Depósito');
    if (userId === receiver.id) return setName(owner.user.name);
    setName(receiver.user.name);
  };

  return (
    <div className='flex flex-col justify-between items-center'>
      <div className='w-full mb-1'>
        {transactionType !== 'Depósito' && (
          <p className='text-indigo-900 font-semibold text-sm text-left'>
            {transactionType}
          </p>
        )}
      </div>

      <div className='flex justify-between w-full items-center'>
        <p className='w-1/2'>{name}</p>

        <div className='flex flex-col items-end'>
          <p
            className={`${
              userId === receiver.id ? 'text-green-600' : 'text-red-600'
            } font-bold`}
          >
            {`${userId === receiver.id ? '' : '-'}${value.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              }
            )}`}
          </p>

          <p>
            {new Date(created).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
          </p>
        </div>
      </div>

      <hr className='w-full mt-4' />
    </div>
  );
}

export default Transaction;
