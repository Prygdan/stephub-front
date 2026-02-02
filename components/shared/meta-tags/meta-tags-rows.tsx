import React from 'react';

interface Props {
  label: string
  value?: string
  limit: number
}

export const MetaTagsRows: React.FC<Props> = ({ label, value, limit }) => {
  const length = value?.length ?? 0;
  const status =
    length === 0
      ? 'text-muted-foreground'
      : length > limit
        ? 'text-red-600'
        : length > limit * 0.9
          ? 'text-yellow-600'
          : 'text-green-600'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className={status}>
          {length}/{limit}
        </span>
      </div>

      {value
        ? <span className="block break-words">{value}</span>
        : <span className="block text-muted-foreground">Не задано</span>
      }
    </div>
  );
}
