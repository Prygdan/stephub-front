'use client';

import React from 'react';
import Link from 'next/link';
import * as API from '@/services/products';
import { AxiosError } from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ProductImageList } from '@/components/shared/product-image-list';
import { Loading } from '@/components/shared/loading';
import { AlertMessage } from '@/components/shared/alert';
import {
  getClient as getProductReviews,
  ProductReviewWithAverageRating,
} from '@/services/product-reviews/product-review';
import { ProductDetails } from '@/components/shared/product/product-details';
import { Review } from '@/components/shared/review/review';
import { PenLine, Trash2 } from 'lucide-react';
import { usePaginatedCrud } from '@/hooks/use-paginated-crud';

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultProduct: API.TProduct = {
    id: '', slug: '',
    category_id: '',  subcategory_id: '', season_id: '', material_id: '', brand_id: '',
    name: '', article: '', description: '',
    sizes: [],
    price: Number(), discount: Number(),
    is_active: true
  };
  const { destroy } = usePaginatedCrud<API.TProduct>(API, defaultProduct);

  const [product, setProduct] = React.useState<API.TProduct | null>(null);
  const [reviews, setReviews] =
    React.useState<ProductReviewWithAverageRating | null>(null);

  const [loadingProduct, setLoadingProduct] = React.useState(false);
  const [loadingReviews, setLoadingReviews] = React.useState(false);
  const [errors, setErrors] = React.useState<string | null>(null);

  const page = Number(searchParams.get('page')) || 1;

  const handleDestroy = async () => {
    product && await destroy(product.slug ?? '');
    router.push('/admin/products');
  }

  /* ---------------- product ---------------- */
  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const response = await API.show(slug);
        response.status == 200 && setProduct(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setErrors('Loading product: ' + error.response?.data.message);
        }
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [slug]);

  /* ---------------- reviews ---------------- */
  const fetchReviews = async () => {
    if (!product) return;
    
    try {
      setLoadingReviews(true);
      const reviews = await getProductReviews({
        productSlug: product.slug ?? '',
        page,
      });
      setReviews(reviews);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors('Loading comments: ' + error.response?.data.message);
      }
    } finally {
      setLoadingReviews(false);
    }
  };
  
  React.useEffect(() => {
    fetchReviews();
  }, [product, setProduct, page]);

  return (
    <div className='max-w-225'>
      {errors && (
        <AlertMessage
          type="error"
          title="Помилка!"
          message={errors}
          callback={() => setErrors(null)}
        />
      )}
      <div className='relataive'>
        <div className='absolute flex gap-1 z-50 right-0 top-5'>
          {product 
            && <>
                <Link href={`/admin/products?edit-slug=${product?.slug}`} title='Редагувати' className='mr-1'>
                  <PenLine size={22} />
                </Link>
                <Trash2 
                  size={22}
                  className='cursor-pointer'  
                  onClick={() => handleDestroy()} />
              </> }
        </div>
        {loadingProduct && <Loading className='' />}
        {product && <div>
            <div className='mb-2'>
              <div className='text-[14px]'>
                <span className='block text-neutral-500'>Meta Title:</span>
                <p>{product?.meta_title}</p>
              </div>
              <div className='text-[14px]'>
                <span className='block text-neutral-500'>Meta Description:</span>
                <p>{product?.meta_description}</p>
              </div>
              <div className='text-[14px]'>
                <span className='block text-neutral-500'>Meta Keywords:</span>
                <p>{product?.meta_keywords}</p>
              </div>
            </div>
            <ProductDetails product={product} admin={true} />
          </div>}
      </div>
      <div className='relataive mt-3'> 
        {product && <ProductImageList product={product} />}
      </div>
      {product && reviews && (
        <div className='relataive'>
          {loadingReviews && <Loading className='' />}
          <Review
            admin={true}
            refetch={fetchReviews}
            product={product}
            productReviews={reviews.reviews}
            averageRating={reviews.average_rating} />
        </div>
      )}
    </div>
  );
}
