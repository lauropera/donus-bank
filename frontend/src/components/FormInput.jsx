import { string, shape } from 'prop-types';

function FormInput({ labelText, name, id, errors, type, registerInput }) {
  return (
    <div>
      <label className='block mb-2 font-medium text-slate-900' htmlFor={id}>
        {labelText}
      </label>
      <input
        className={`w-full p-2 mb-3 text-slate-900 border-b-2
          border-emerald-600 outline-none focus:bg-gray-300 transition-all`}
        type={type}
        name={name}
        id={id}
        {...registerInput}
      />
      <p className='mb-3 text-red-600'>{errors[name]?.message}</p>
    </div>
  );
}

FormInput.propTypes = {
  labelText: string.isRequired,
  name: string.isRequired,
  id: string.isRequired,
  errors: shape({}).isRequired,
  type: string.isRequired,
  registerInput: shape({}).isRequired,
};

export default FormInput;
