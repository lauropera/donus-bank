import { useEffect, useState } from 'react';
import DateInput from './DateInput';
import Transaction from './Transaction';
import Header from '../../components/Header';
import useApiGet from '../../hooks/useApiGet';
import useLogoutVerify from '../../hooks/useLogoutVerify';

const DATE_OBJ = {
  start: undefined,
  end: undefined,
};

function Transactions() {
  const [filterOption, setFilterOption] = useState('');
  const [dateFilters, setDateFilters] = useState(DATE_OBJ);
  const [selectedDates, setSelectedDates] = useState(DATE_OBJ);
  const {
    data: user,
    errorStatus,
    isFetching: isUserFetching
  } = useApiGet('user');
  const {
    data: transactions,
    isFetching,
    refresh,
    setRefresh,
  } = useApiGet('transactions', {
    filter: filterOption,
    starts: selectedDates.start,
    ends: selectedDates.end,
  });
  useLogoutVerify(errorStatus);

  const formatDate = (date) => new Date(date).toLocaleDateString('zh-Hans-CN');

  const dateConfig = (date, dateType) => {
    date = date === null ? undefined : date;
    setSelectedDates({ ...selectedDates, [dateType]: date });
    setDateFilters({ ...dateFilters, [dateType]: formatDate(date) });
  };

  useEffect(() => {
    setRefresh(!refresh);
  }, [filterOption, selectedDates.start, selectedDates.end]);

  return (
    <div className='font-body'>
      <Header />
      <main
        className='flex flex-col mt-14 h-[calc(100vh-3.5rem)]
        items-center gap-5 bg-slate-200'
      >
        <div
          className='w-full max-w-xs mt-4 sm:max-w-sm flex
          bg-slate-50 rounded py-3 px-4 h-32 md:max-w-lg
          justify-center'
        >
          <div className='flex gap-3 flex-col md:max-w-xs'>
            <div className='flex gap-2'>
              <label>
                De:
                <DateInput
                  selectedDates={selectedDates}
                  dateType='start'
                  dateConfig={dateConfig}
                />
              </label>

              <label>
                Até
                <DateInput
                  selectedDates={selectedDates}
                  dateType='end'
                  dateConfig={dateConfig}
                />
              </label>
            </div>

            <label className='flex gap-2 items-center'>
              Tipo:
              <select
                className='w-full px-2 py-1 border-b-2 transition-all
                  border-emerald-600 outline-none focus:bg-gray-300'
                onChange={(e) => setFilterOption(e.target.value)}
              >
                <option value=''>Todas</option>
                <option value='sent'>Enviadas</option>
                <option value='received'>Recebidas</option>
              </select>
            </label>
          </div>
        </div>

        <section
          className='w-full max-w-xs sm:max-w-sm md:max-w-lg
        bg-slate-50 rounded p-5 h-4/6 overflow-x-auto'
        >
          {!isFetching && !isUserFetching && (
            <div className='flex flex-col gap-5'>
              {transactions.map(
                ({
                  id,
                  value,
                  createdAt,
                  ownerAccount,
                  receiverAccount,
                  transactionType,
                }) => {
                  return (
                    <Transaction
                      key={id}
                      userId={user.id}
                      value={value}
                      created={createdAt}
                      owner={ownerAccount}
                      receiver={receiverAccount}
                      transactionType={transactionType.name}
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
