import React from 'react';
import CartClient from './cart-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Корзина | Zmy',
  description: 'Ваша корзина на Zmy. Перегляньте товари перед оформленням замовлення.',
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    }
  },
  alternates: {
    canonical: `${process.env.APP_URL}/cart`,
  },
  openGraph: {
    title: 'Корзина | Zmy',
    description: 'Ваша корзина на Zmy. Перегляньте товари перед оформленням замовлення.',
    url: `${process.env.APP_URL}/cart`,
    locale: 'uk_UA',
    images: [
      {
        url: `${process.env.APP_URL}/logo-white.png`,
        width: 1200,
        height: 630,
        alt: 'Корзина Zmy',
      },
    ],
  },
};

export default function Page() {
  return (
    <div>
      <CartClient />
    </div>
  );
};
