import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  message: string;
  type?: 'success' | 'error';
  className?: string;
  callback?: () => void
}

export const AlertMessage: React.FC<Props> = ({ 
  title, 
  message, 
  callback,
  type = 'success', 
  className 
}) => {
  const isError = type === 'error';

  const icon = isError ? (
    <XCircle className="h-5 w-5 text-red-500" />
  ) : (
    <CheckCircle2 className="h-5 w-5 text-green-500" />
  );

  return (
    <Alert
      className={cn(
        'relative flex items-start gap-3 border-l-4',
        isError
          ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200'
          : 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200',
        className
      )}
    >
      {icon}
      <div>
        <X 
          size={20} 
          onClick={callback}
          className='block absolute right-1 top-1 cursor-pointer hover:text-red-900 transition-colors' />
        <AlertTitle className="font-semibold">{title}</AlertTitle>
        <AlertDescription className="text-sm">{message}</AlertDescription>
      </div>
    </Alert>
  );
};
