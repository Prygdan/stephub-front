import React from 'react'
import { Metadata } from "next";
import { Container } from '@/components/shared/container'
import { Client } from './client';

const canonical = `${process.env.NEXT_PUBLIC_SITE_URL}/login`;

export const metadata: Metadata = {
  title: "Увійти до облікового запису",
  description:
    "Авторизуйтесь, щоб отримати доступ до персонального кабінету. Вхід через E-mail та пароль.",
  keywords: ["вхід", "логін", "авторизація",],
  openGraph: {
    title: "Увійти до облікового запису",
    description:
      "Авторизуйтесь, щоб отримати доступ до свого профілю.",
    url: canonical,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    locale: "uk_UA",
    type: "website",
  },
  alternates: {
    canonical,
  },
};

const Page = () => {
  return (
    <Container className='min-h-[100vh] flex flex-col justify-center'>
      <Client />
    </Container>
  )
}

export default Page
