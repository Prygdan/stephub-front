import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Container } from "@/components/shared/container";
import { ProductDetails } from "@/components/shared/product/product-details";
import { show } from "@/services/products";
import { notFound } from "next/navigation";
import { get as getProductReviews } from '@/services/product-reviews/product-review';
import { revalidateTag } from "next/cache";
import { loadSearchParams } from "./search-params";
import { Review } from "@/components/shared/review/review";

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