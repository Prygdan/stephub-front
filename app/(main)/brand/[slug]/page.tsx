import { notFound } from "next/navigation";
import { loadSearchParams } from "./search-params";
import { show as getBrandProducts } from "@/services/brands";
import { revalidateTag } from "next/cache";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ListTemplate } from "@/components/shared/list-template";
import { ProductListCard } from "@/components/shared/product/product-list-card";
import { ProductsPagination } from "@/components/shared/products-pagination";
import { Filters } from "@/components/shared/filters/filters";

export default async function Page({ params, searchParams }: any) {
  try {
    const { slug } = await params;
    const filters = await loadSearchParams(searchParams);
    const brand = await getBrandProducts({
      slug: slug,
      page: filters.page,
      searchParams: filters
    });
    
    if(!brand) return notFound();

    async function refetchCategoryProducts() {
      "use server";
      revalidateTag("brand");
    }

    return <Container>
        {/* Header Page */}
      <h1 className='text-[23px] md:text-[28px] pt-5 pb-2 uppercase tracking-widest font-medium'>
        {brand.brand.name}
      </h1>
      <Breadcrumbs
        items={[
          {label:`${brand.brand.name}`, url: `${brand.brand.slug}`},
        ]}
        className='flex justify-start pb-5'
      />
        {/* End Header Page */}
        {/* Content Page */}
      <div className="md:flex md:gap-2">
        <Filters type={brand.brand} />

        {brand.products && <ListTemplate>
          {brand.products.data.map((product) => (<div key={product.id}>
            {product && <ProductListCard product={product} />}
          </div>))}
        </ListTemplate>}
      </div>
      {brand.products.last_page >= Number(process.env.NEXT_PUBLIC_PAGINATION_COUNT) &&
        <ProductsPagination
          refetchProducts={refetchCategoryProducts} 
          lastPage={brand.products.last_page} 
          className='my-8' 
        />
      }
        {/* End Content Page */}
    </Container>
  } catch (error: unknown) {
      //  return notFound();
      console.log(error)
  }
}