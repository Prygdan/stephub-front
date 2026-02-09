'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthErrors, useAuth } from '@/hooks/use-auth';
import { InputText } from '@/components/shared/inputs';
import { Button } from '@/components/ui/button';
import { AuthSessionStatus } from '@/components/shared/auth-session-status';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  className?: string
}

export const Client: React.FC<Props> = ({ className }) => {
  const searchParams = useSearchParams();

  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/admin',
  });

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [shouldRemember, setShouldRemember] = React.useState(false);
  const [errors, setErrors] = React.useState<AuthErrors>({});
  const [status, setStatus] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const reset = searchParams.get('reset');
    if (reset && Object.keys(errors).length === 0) {
      setStatus(decodeURIComponent(reset));
    } else {
      setStatus(null);
    }
  }, [searchParams, errors]);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      await login({
        email,
        password,
        remember: shouldRemember,
        setErrors,
        setStatus,
      });
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn('w-full mx-auto max-w-sm', className)}>
      <CardHeader>
        <CardTitle>Увійдіть до облікового запису</CardTitle>

        {status && <AuthSessionStatus className="mb-4" status={status} />}
      </CardHeader>

      <CardContent>
        <form onSubmit={submitForm}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <InputText
                name="email"
                label="Введіть свій E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                errors={errors.email}
                placeholder="m@example.com"
              />
            </div>
            <div className="grid gap-2">
              <InputText
                name="password"
                type="password"
                label="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                errors={errors.password}
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="block mt-4">
            <label htmlFor="remember_me" className="inline-flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                name="remember"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onChange={(e) => setShouldRemember(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-600">Запам’ятати мене</span>
            </label>
          </div>

          <div className="relative mt-5">
            {loading && <Skeleton className='absolute left-0 top-0 w-full h-full' />}
            <Button type="submit" className="w-full cursor-pointer">
              Вхід
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <Link
          href="/"
          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
        >
          На головну
        </Link>
      </CardFooter>
    </Card>
  );
};
