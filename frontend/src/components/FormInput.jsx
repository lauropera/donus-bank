import React from 'react';
import { string, shape } from 'prop-types';

function FormInput({
  labelText,
  name,
  id,
  type,
  errors,
  registerInput,
  step,
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
        step={step}
        maxLength={maxLength}
        {...registerInput}
      />

      <p className='mb-3 text-red-600'>{errors[name]?.message}</p>
    </div>
  );
}

FormInput.defaultProps = {
  step: '',
  maxLength: '',
};

FormInput.propTypes = {
  labelText: string.isRequired,
  name: string.isRequired,
  id: string.isRequired,
  type: string.isRequired,
  errors: shape({}).isRequired,
  registerInput: shape({}).isRequired,
  step: string,
  maxLength: string,
};

export default FormInput;
