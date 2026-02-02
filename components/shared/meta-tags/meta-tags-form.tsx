import React from 'react';
import { TMetaTags } from '@/lib/types';
import { InputText, TextArea } from '../inputs';

type Props = {
  item:       TMetaTags;
  setItem:    (val: Partial<TMetaTags>) => void;
  errors?:    Record<string, string[]>;
  className?: string
};

export const MetaTagsForm: React.FC<Props> = ({ item, setItem, errors, className }) => {
  return (
    <div className={className}>
      <div className="mb-2">
        <InputText
          label="Meta title"
          name="meta_title"
          value={item.meta_title || ""}
          onChange={(e) => setItem({ meta_title: e.target.value })}
          errors={errors!.meta_title}
          placeholder="SEO заголовок"
        />
        <div className="mt-2 text-sm text-right text-muted-foreground">{item.meta_title?.length || 0} символів</div>
      </div>

      <div className="mb-2">
        <TextArea
          label="Meta description"
          name="meta_description"
          value={item.meta_description || ""}
          onChange={(e) => setItem({ meta_description: e.target.value })}
          errors={errors!.meta_description}
          placeholder="Короткий опис для пошуковиків"
        />
        <div className="mt-2 text-sm text-right text-muted-foreground">{item.meta_description?.length || 0} символів</div>
      </div>

      <div className="mb-2">
        <TextArea
          label="Meta keywords"
          name="meta_keywords"
          value={item.meta_keywords || ""}
          onChange={(e) => setItem({ meta_keywords: e.target.value })}
          errors={errors!.meta_keywords}
          placeholder="Ключові слова через кому"
        />
        <div className="mt-2 text-sm text-right text-muted-foreground">{item.meta_keywords?.length || 0} символів</div>
      </div>
    </div>
  );
};
