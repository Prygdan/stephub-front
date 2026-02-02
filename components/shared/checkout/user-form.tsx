'use client';

import React from 'react';
import { InputText } from '../inputs';
import { cn, handleChangePhone } from '@/lib/utils';
import { TGuest } from '@/services/order';
import { TUser } from '@/hooks/use-auth';

interface Props {
  getData: (data: TGuest) => void
  success?: boolean
  errors: Record<string, string[]>
  user?: TUser
  className?: string
}

export const UserForm: React.FC<Props> = ({ user, getData, errors, success=false, className }) => {
  const [name, setName] = React.useState<string>('');
  const [surname, setSurname] = React.useState<string>('');
  const [middle_name, setMiddle_name] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');

  React.useEffect(() => {
    if(user && user.guest?.name) {
      setName(user?.guest?.name)
    }
    if(user && user.guest?.middle_name) {
      setMiddle_name(user.guest?.middle_name)
    }
    if(user && user.guest?.surname) {
      setSurname(user.guest.surname)
    }
    if(user && user.guest?.phone) {
      setPhone(user.guest.phone)
    }
  }, [user]);

  React.useEffect(() => {
    if (!user) {
      setPhone('+380');
    }
  }, []);

  React.useEffect(() => {
    if (name || surname || middle_name || phone) {
      const data: TGuest = {
        name,
        surname,
        middle_name,
        phone,
      };
      getData(data);
    }
  }, [name, surname, middle_name, phone]);

  return (
      <div className={cn(className)}>
        <span className='block uppercase text-[14px] font-bold tracking-wider'>Дані покупця</span>
        <div className='mt-3'>
          <InputText
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            label={'Прізвище'}
            name={'surname'}
            errors={errors?.surname}
            labelClassName='font-light'
            required
          />
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
            label={'Ім\'я'}
            name={'name'}
            errors={errors?.name}
            className='mt-5'
            labelClassName='font-light'
            required
          />
          <InputText
            value={middle_name}
            onChange={(e) => setMiddle_name(e.target.value)}
            label={'По батькові'}
            name={'middle_name'}
            errors={errors?.middle_name}
            className='mt-5'
            labelClassName='font-light'
          />
          <InputText
            value={phone}
            onChange={(e) => handleChangePhone(e, setPhone)}
            label={'Телефон'}
            name={'phone'}
            errors={errors?.phone}
            className='mt-5'
            labelClassName='font-light'
            required
          />
        </div>
      </div>
  );
};
