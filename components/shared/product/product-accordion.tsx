'use client';

import React from 'react';
import { Cog, CreditCard, Minus, Plus } from 'lucide-react';

interface Props {
  className?: string
}

export const ProductAccordion: React.FC<Props> = ({ className }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const items = [
    {
      title: "Варіанти оплати",
      icon: <CreditCard size={20} className="text-neutral-400" />,
      content: [
        "Готівкою при отриманні",
        "Картами Visa і MasterCard",
        "Оплата за рахунком",
        "Безготівковий розрахунок",
      ],
    },
    {
      title: "Наші переваги",
      icon: <Cog size={20} className="text-neutral-400" />,
      content: [
        "Більше 10 років на ринку",
        "17 реальних магазинів",
        "Гарантія якості",
        "Найкраща ціна",
      ],
    },
  ]

  const handleOpneItem = (index: number) => {
    setOpenIndex(index === openIndex ? null : index)
  }

  return (
    <div className={className}>
      {items.map((block, i) => (
      <div onClick={() =>handleOpneItem(i)} key={block.title}>
        <div className='flex group justify-between py-2 border-t border-r-neutral-200 transition-all cursor-pointer'>
          <div className='flex items-center gap-1'>
            {block.icon}
            <span className='font-bold group-hover:text-[#86b395]'>{block.title}</span>
          </div>
          
          {openIndex !== i ? <Plus size={20}/> : <Minus size={20} />}
        </div>

        {openIndex === i &&
        <div>
          <ul className='text-[14px] list-disc ml-10 mb-5'>
            {block.content.map((block) => (
              <li className='mt-1' key={block}>- {block}</li>
            ))}
          </ul>
        </div>}
      </div>
      ))}
    </div>
  );
};
