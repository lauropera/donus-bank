import DatePicker from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-datepicker/dist/react-datepicker.css';

function DateInput({ selectedDates, dateType, dateConfig }) {
  return (
    <DatePicker
      isClearable
      locale={ptBR}
      selected={selectedDates[dateType]}
      onChange={(date) => dateConfig(date, dateType)}
      dateFormat='dd/MM/yyyy'
      placeholderText='dd/mm/yyyy'
      className='w-full px-2 py-1 border-b-2 border-emerald-600
      outline-none focus:bg-gray-300 transition-all'
    />
  );
}

export default DateInput;
