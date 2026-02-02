import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Facebook, Instagram, Send } from 'lucide-react';

interface Props {
  className?: string
  facebookHref?: string
  instagramHref?: string
  telegramHref?: string
  strokeWidth?: number
  width?: number
}

export const SocialMedia: React.FC<Props> = ({ className, width = 36, strokeWidth=1.2, facebookHref='#', instagramHref='#', telegramHref='#' }) => {
  return (
    <div className={cn(className, 'flex')}>
      <Link href={facebookHref}>
        <Facebook size={width} strokeWidth={strokeWidth} />
      </Link>
      <Link href={instagramHref}>
        <Instagram size={width} strokeWidth={strokeWidth} />
      </Link>
      <Link href={telegramHref}>
        <Send size={width} strokeWidth={strokeWidth} />
      </Link>
    </div>
  );
};
