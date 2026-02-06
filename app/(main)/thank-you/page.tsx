import React from 'react';
import { show } from '@/services/pages';
import { Container } from '@/components/shared/container';
import { Description } from '@/components/shared/description';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> { 
  const baseUrl = process.env.APP_URL;
  const pageURL = baseUrl + '/';
  let contentPage;
  try{
    contentPage = await show('thank-you');
  } catch (error) {
    return notFound();
  }

  const title = contentPage?.meta_title 
    ?? 'Інтернет-магазин оригінального взуття - StepHub';
  const description = contentPage?.meta_description 
    ?? 'Купити оригінальне взуття всіх відомих брендів, вигідно, доставка 1-3 дні';
  const keywords = contentPage?.meta_keywords 
    ?? 'куросівки, кеди, чоловікам, жінкам, купити';

  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      }
    },
    alternates: {
      canonical: pageURL,
      languages: {
        'uk-UA': pageURL,
      },
    },
    openGraph: {
      title,
      description,
      url: pageURL,
      locale: 'uk_UA',
      images: [
        {
          url: `${baseUrl}/favicon.ico`,
          width: 1200,
          height: 630,
          alt: 'Інтернет-магазин оригінального взуття - StepHub'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/favicon.ico`],
    }
  };
}

export default async function Page() {
  try {
    const data = await show('thank-you');

    return <Container>
        {/* <h1>{data && data.title}</h1> */}
        {data && <Description description={data.content} className='pt-4' />}
      </Container>
  } catch (error) {
    return notFound();
  }
};