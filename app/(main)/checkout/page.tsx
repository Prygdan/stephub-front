import React from 'react';
import CheckoutClient from './checkout-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Оформлення замовлення | Zmy",
  description:
    "Оформіть замовлення на Zmy. Введіть контактні дані та виберіть спосіб доставки.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: `${process.env.APP_URL}/checkout`,
  },
  openGraph: {
    title: "Оформлення замовлення | Zmy",
    description:
      "Оформіть замовлення на Zmy. Введіть контактні дані та виберіть спосіб доставки.",
    url: `${process.env.APP_URL}/checkout`,
    type: "website",
    locale: "uk_UA",
    images: [
      {
        url: `${process.env.APP_URL}/favicon.ico`,
        width: 1200,
        height: 630,
        alt: "Оформлення замовлення Zmy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Оформлення замовлення | Zmy",
    description:
      "Оформіть замовлення на Zmy. Введіть контактні дані та виберіть спосіб доставки.",
    images: [`${process.env.APP_URL}/favicon.ico`],
  },
};

export default function Page() {
  return (
    <CheckoutClient />
  );
};
