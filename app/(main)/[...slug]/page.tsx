import { notFound } from "next/navigation";
import { revalidateTag } from "next/cache";
import { loadSearchParams } from "./search-params";
import { show as getCategory } from '@/services/categories';
import { show as getSubcategory, TSubcategoryWithProducts } from '@/services/subcategories';
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Description } from "@/components/shared/description";
import { ListTemplate } from "@/components/shared/list-template";
import { ProductListCard } from "@/components/shared/product/product-list-card";
import { Carousel } from "@/components/shared/carousel";
import { ProductsPagination } from "@/components/shared/products-pagination";
import { Filters } from "@/components/shared/filters/filters";

export default async function Page({ params, searchParams }: any) {
  try {
    const { slug } = await params;
    const filters = await loadSearchParams(searchParams);

    if (!Array.isArray(slug) || slug.length > 2) notFound();

    /* GET CATEGORY */
    const category = await getCategory({
      slug: slug[0],
      page: filters.page,
      searchParams: filters
    });
    if(!category) return notFound();

    /* GET SUBCATEGORY */
    let subcategory: TSubcategoryWithProducts | null = null;
    if (slug[1]) {
      subcategory = await getSubcategory({
        slug: slug[1],
        page: filters.page,
        searchParams: filters
      });
      if(!subcategory) return notFound();
    }

    async function refetchCategoryProducts() {
      "use server";
      revalidateTag("category");
    }

    async function refetchSubcategoryProducts() {
      "use server";
      revalidateTag("subcategory");
    }

    return <div>
      {!subcategory && category
      ? /* Render Category Page */
      <Container>
        <h1 className='text-[23px] md:text-[28px] pt-5 pb-2 uppercase tracking-widest font-medium'>
          {category.category.name}
        </h1>
        <Breadcrumbs
          items={[
            {label:`${category.category.name}`, url: `${category.category.slug}`},
          ]}
          className='flex justify-start pb-5'
          />
        <div className="md:flex md:gap-5"> 
          <Filters type={category.category} />
          <div>
            {category.category.carousel && 
              <Carousel carousel={category.category.carousel} className="mb-4" />}
              
            {category.products && <ListTemplate>
              {category.products.data.map((product) => (<div key={product.id}>
                {product && <ProductListCard product={product} />}
              </div>))}
            </ListTemplate>}
          </div>
        </div>
        {category.products.last_page >= Number(process.env.NEXT_PUBLIC_PAGINATION_COUNT) &&
          <ProductsPagination
            refetchProducts={refetchCategoryProducts} 
            lastPage={category.products.last_page} 
            className='my-8' 
          />
        }
        {category.category.description && 
          <Description 
            description={category.category.description} 
            className='text-neutral-500 pt-10 pb-5'
            size="13" 
          />
        }
      </Container>
      
        /* Render Subcategory Page */
      : subcategory?.subcategory ? 
      <Container>
        <h1 className='text-[23px] md:text-[28px] pt-5 pb-2 uppercase tracking-widest font-medium'>
          {subcategory.subcategory.name}
        </h1>
        <Breadcrumbs
          items={[
            {label:`${category.category.name}`, url: `${category.category.slug}`},
            {label:`${subcategory.subcategory.name}`, url: `${subcategory.subcategory.slug}`},
          ]}
          className='flex justify-start pb-5'
          />
        <div className="flex md:gap-5">
          <Filters type={subcategory.subcategory} />
          <div>
            {subcategory.products && <ListTemplate>
              {subcategory.products.data.map((product) => (<div key={product.id}>
                {product && <ProductListCard product={product} />}
              </div>))}
            </ListTemplate>}
          </div>
        </div>

        {subcategory.subcategory.description && 
          <Description 
            description={subcategory.subcategory.description} 
            className='text-neutral-500 pt-10 pb-5'
            size="13" 
          />
        }

        {subcategory.products.last_page >= Number(process.env.NEXT_PUBLIC_PAGINATION_COUNT) &&
          <ProductsPagination
            refetchProducts={refetchSubcategoryProducts} 
            lastPage={subcategory.products.last_page} 
            className='my-8' 
          />
        }
        
      </Container>
      : <>{notFound()}</>
      }
    </div> 
  } catch (eror) {
    return notFound()
  } 
}
