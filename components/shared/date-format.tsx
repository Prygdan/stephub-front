import React from 'react';

interface Props {
  date: string;
}

export const DateFormat: React.FC<Props> = ({ date }) => {
  if (!date) return null;

  return <span>{new Date(date).toLocaleDateString()}</span>;
};
