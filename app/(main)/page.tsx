import React from 'react';
import { Container } from '@/components/shared/container';
import { get as getBrands } from '@/services/brands';
import { BrandsList } from '@/components/shared/brands-list';
import { get, getDiscountProducts } from '@/services/products';
import { ListTemplate } from '@/components/shared/list-template';
import { ProductListCard } from '@/components/shared/product/product-list-card';
import { ListTitle } from '@/components/shared/list/list-title';
import { HomePage } from '@/components/shared/home-page';
import { getCarouselsHome } from '@/services/carousels';

export default async function Page() {
  const carousel = (await getCarouselsHome()).data;
  const brands = (await getBrands()).data;
  const discountProducts = (await getDiscountProducts({page: 1})).data;
  const newProducts = (await get()).data;

  return (
    <div className='mb-32'>
      {carousel && <HomePage carousel={carousel} />}

      <Container>
        {/* Brands List */}
        {brands && <div className='relative mt-13'>
          <BrandsList brands={brands} />
        </div>}

        {/* Discount Products */}
        <ListTitle title='Знижки' className='my-6' />
        {discountProducts && <ListTemplate>
          {discountProducts.map((product) => (<div key={product.id}>
            {product && <ProductListCard product={product} />}
          </div>))}
        </ListTemplate>}

        {/* New Products */}
        <ListTitle title='Новинки' className='my-6' />
        {newProducts && <ListTemplate>
          {newProducts.data.map((product) => (<div key={product.id}>
            {product && <ProductListCard product={product} />}
          </div>))}
        </ListTemplate>}
      </Container>
    </div>
  );
};
