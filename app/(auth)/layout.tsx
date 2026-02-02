import React from 'react';
import Loading from './loading';
import '../styles/front.css';

interface Props {
  children?: React.ReactNode
}

export const metadata = {
  title: 'Authorization',
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <React.Suspense fallback={<Loading />}>
      <main>
        {children}
      </main>
    </React.Suspense>
  );
};

export default AuthLayout;