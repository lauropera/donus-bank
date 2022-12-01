import { useState } from 'react';
import Header from '../components/Header';
import Transaction from '../components/Transaction';
import useApiGet from '../hooks/useApiGet';

function Transactions() {
  const [filterOption, setFilterOption] = useState('');
  const { data, isFetching } = useApiGet('transactions', filterOption);
  const user = useApiGet('user');

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
        >
          <div>
            <label className='flex flex-col'>
              Tipo
              <select onChange={(e) => setFilterOption(e.target.value)}>
                <option value=''>Todas</option>
                <option value='sent'>Enviadas</option>
                <option value='received'>Recebidas</option>
              </select>
            </label>
          </div>
        </div>

        <section
          className='w-full max-w-xs sm:max-w-sm
        bg-slate-50 rounded p-5 h-4/6 overflow-scroll'
        >
          {!isFetching && !user.isFetching && (
            <div className='flex flex-col gap-5'>
              {data.map(
                ({
                  id,
                  createdAt,
                  ownerAccount,
                  receiverAccount,
                  transactionType,
                  value,
                }) => {
                  return (
                    <Transaction
                      key={id}
                      userId={user.data.id}
                      created={createdAt}
                      owner={ownerAccount}
                      receiver={receiverAccount}
                      transactionType={transactionType}
                      value={value}
                    />
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Transactions;
