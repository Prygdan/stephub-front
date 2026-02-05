'use client';

import React from 'react';
import Link from 'next/link';
import { AuthErrors, useAuth } from '@/hooks/use-auth';
import { InputText } from '@/components/shared/inputs';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/shared/container';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const { register } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  });

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
  const [errors, setErrors] = React.useState<AuthErrors>({});

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      setErrors,
    })
  }

  return (
    <Container className='mt-5 flex flex-col justify-center'>
      <Card className="w-full mx-auto max-w-sm">
        <CardHeader>
          <CardTitle>Створити обліковий запис</CardTitle>
          <CardDescription>
            Введіть свої дані нижче, щоб створити обліковий запис
          </CardDescription>
          <CardAction>
            <Link href={'/login'} className='text-sm'>Вхід</Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitForm}>
            <InputText 
              name='name'
              label='Введіть своє ім`я'
              value={name}
              onChange={event => setName(event.target.value)}
              errors={errors.name}
            />
            <InputText 
              name='email'
              label='Введіть свій E-mail'
              value={email}
              onChange={event => setEmail(event.target.value)}
              errors={errors.email}
              className='mt-4'
            />
            <InputText 
              name='password'
              label='Придумайте пароль'
              value={password}
              onChange={event => setPassword(event.target.value)}
              errors={errors.password}
              className='mt-4'
              type='password'
            />
            <InputText 
              name='passwordConfirmation'
              label='Повторіть пароль'
              value={passwordConfirmation}
              onChange={event => setPasswordConfirmation(event.target.value)}
              errors={errors.passwordConfirmation}
              className='mt-4'
              type='password'
            />
           
            <Button type="submit" className="w-full mt-5">
              Зареєструватись
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};
