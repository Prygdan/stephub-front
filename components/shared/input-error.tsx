import React from 'react';

interface Props {
  messages: string[]
  className?: string
}

export const InputError: React.FC<Props> = ({ messages = [], className }) => {
  if(messages?.length === 0 ) return null;
  
  return (
    <div className={`text-xs text-red-600 ${className}`}>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  )
};