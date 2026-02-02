import Link from 'next/link';
import React from 'react';

interface Props {
  email: string
  className?: string
}

export const EmailLink: React.FC<Props> = ({ email, className }) => {
  return (
    <Link href={`mailto:${email}`} className={className}>
      {email}
    </Link>
  );
};
