"use client";

import React from 'react';
import { InputSelectMultiple } from '@/components/shared/react-select';
import { useSizes } from '@/hooks/filters/use-sizes';
import { Skeleton } from '../ui/skeleton';

type ProductMultiSelectType = 'sizes';

interface Props {
  name: string;
  label: string;
  type: ProductMultiSelectType;
  selected: string[];
  setSelected: (value: string[]) => void;
  errors?: string[];
  className?: string;
  inputClassName?: string;
}

export const AnimationMultiSelect: React.FC<Props> = ({
  name,
  label,
  type,
  selected,
  setSelected,
  errors,
  className,
  inputClassName
}) => {
  const { sizes, loading: loadingSizes } = useSizes(true);

  const [options, setOptions] = React.useState<{ value: string; label: string }[]>([]);
  const loading = loadingSizes;

  React.useEffect(() => {
    switch (type) {
      case 'sizes':
        if (sizes) setOptions(sizes.map(g => ({ value: g.id, label: g.value_cm != null ? `EU: ${g.value_eu}-(${g.value_cm} CM)` : `EU: ${g.value_eu}` })));
        break;
    }
  }, [type, sizes]);

  return (
    <div className='w-full relative'>
      {loading && <Skeleton className='absolute z-40 w-full h-full left-0 top-0' />}
      <InputSelectMultiple
        name={name}
        label={label}
        /*  text={`Виберіть ${label.toLowerCase()}`} */
        options={options}
        value={selected}
        defaultValue={selected}
        onValueChange={(val: string[]) => setSelected(val)}
        errors={errors}
        className={className}
        inputClassName={inputClassName}
      />
    </div>
  )
};
