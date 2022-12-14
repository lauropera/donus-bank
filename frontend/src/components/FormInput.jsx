import React from 'react';

function FormInput({
  labelText,
  name,
  id,
  type,
  errors,
  registerInput,
  placeholder,
  inputValue,
  maxLength,
}) {
  return (
    <div>
      <label className='block mb-2 font-medium text-emerald-900' htmlFor={id}>
        {labelText}
      </label>

      <input
        className='w-full p-2 mb-3 text-emerald-700 border-b-2
          border-emerald-600 outline-none focus:bg-gray-300
          transition-all'
        name={name}
        id={id}
        type={type}
        value={inputValue}
        placeholder={placeholder}
        maxLength={maxLength}
        {...registerInput}
      />

      <p className='mb-3 text-red-600'>{errors[name]?.message}</p>
    </div>
  );
}

export default FormInput;
