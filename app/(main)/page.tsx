import React from 'react';
import { Container } from '@/components/shared/container';
import { getSSR as getBrands } from '@/services/brands';
import { show } from '@/services/pages';
import { BrandsList } from '@/components/shared/brands-list';
import { get, getDiscountProducts } from '@/services/products';
import { ListTemplate } from '@/components/shared/list-template';
import { ProductListCard } from '@/components/shared/product/product-list-card';
import { ListTitle } from '@/components/shared/list/list-title';
import { HomePage } from '@/components/shared/home-page';
import { getCarouselsHome } from '@/services/carousels';
import { Description } from '@/components/shared/description';

export default async function Page() {
  const carousel = (await getCarouselsHome()).data;
  const brands = await getBrands();
  const discountProducts = (await getDiscountProducts({page: 1})).data;
  const newProducts = (await get()).data;
  const contentPage = await show('home');

  return (
    <div>
      {carousel && <HomePage carousel={carousel} />}

      <Container>
        {/* Brands List */}
        {brands && <div className='relative mt-10'>
          <BrandsList brands={brands} />
        </div>}

        {/* Discount Products */}
        {discountProducts && <>
          <ListTitle title='Знижки' className='my-6' />
          <ListTemplate>
            {discountProducts.map((product) => (<div key={product.id}>
              {product && <ProductListCard product={product} />}
            </div>))}
          </ListTemplate>
        </>}

        {/* New Products */}
        {newProducts && <>
        <ListTitle title='Новинки' className='my-6' />
        <ListTemplate>
          {newProducts.data.map((product) => (<div key={product.id}>
            {product && <ProductListCard product={product} />}
          </div>))}
        </ListTemplate>
        </>}
          
        {contentPage && <Description 
          description={contentPage.content}
          size='13'
        />}
        
      </Container>
    </div>
  );
};
