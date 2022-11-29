import React from 'react';
import { useForm } from 'react-hook-form';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div>
      <main>
        <form action=''>
          <div>
            <label>Email</label>
            <input type='text' />
          </div>
          <div>
            <label>Senha</label>
            <input type='password' />
          </div>
        </form>
      </main>
    </div>
  );
}
