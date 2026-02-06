import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Container } from "@/components/shared/container";
import { ProductDetails } from "@/components/shared/product/product-details";
import { show } from "@/services/products";
import { notFound } from "next/navigation";
import { get as getProductReviews } from '@/services/product-reviews/product-review';
import { revalidateTag } from "next/cache";
import { loadSearchParams } from "./search-params";
import { Review } from "@/components/shared/review/review";

export async function generateMetadata({ params }: any) {
  let product;

  try {
    const { slug } = await params;
    product = await show(slug);
  } catch (error) {
    return notFound();
  }

  const p = product.data;
  const pageURL = `${process.env.APP_URL || ''}/product/${p.slug}`;
  const title = p.meta_title || `${p.name} купити в Україні | StepHub`;
  const description = p.meta_description || (p.description ? p.description.slice(0,160) : `${p.name} купити в Україні за вигідною ціною в StepHub`);
  const keywords = p.meta_keywords || `${p.name}, купити, StepHub`;
  const base = process.env.NEXT_PUBLIC_STORAGE_APP_URL;
  const imageUrl = p.images?.[0]?.image ? `${base}/${p.images[0].image}` : null;

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
      locale: 'uk_UA',
      title,
      description,
      url: pageURL,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: p.name,
            },
          ]
        : [],
    },
  }
}

export default async function Page({ params, searchParams }: any) {
  try {
    const { slug } = await params;
    const product = await show(slug);
    const getParams = await loadSearchParams(searchParams);

    if(!product) return notFound();

    /**
     * Get Reviews To Product
     */
    const reviews = product.data && product.data.slug && await getProductReviews({
      productSlug: product.data.slug,
      page: getParams.page
    });

    async function refetchReviews() {
      "use server";
      revalidateTag("reviews");
    }

    return <>
      <Container>
        {product.data.category && 
          <Breadcrumbs
            items={[
              {label:`${product.data.category.name}`, url: `${product.data.category?.slug}`},
              {label:`${product.data.subcategory?.name}`, url: `${product.data.subcategory?.slug}`},
            ]}
            className='flex justify-start py-5'
          />
        }
      </Container>

      <ProductDetails product={product.data} />

      {reviews && <Container>
        <Review 
          product={product.data} 
          productReviews={reviews.reviews} 
          averageRating={reviews.average_rating} 
          refetchReviews={refetchReviews}   
        />  
      </Container>}
    </>
  } catch(error: unknown) {
    return notFound();
  } 
}
