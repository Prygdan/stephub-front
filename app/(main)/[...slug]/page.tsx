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
import { Metadata } from "next";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!Array.isArray(slug) || slug.length > 2 || slug.length === 0) {
    return notFound();
  }

  const filters = await loadSearchParams(searchParams);
  const page = filters.page || 1;
  const hasActiveFilters = page > 1 || [
    filters.priceFrom, filters.priceTo,
    filters.sizes, filters.brands, filters.seasons,
    filters.materials, filters.categories, filters.subcategories,
  ].some(val => val && val !== "" && val !== "default");
  const baseUrl = process.env.APP_URL || '';
  let canonical = `${baseUrl}/${slug.join("/")}`;
  if (page > 1) {
    canonical += `?page=${page}`;
  }

  let title = "";
  let description = "";
  let keywords = "";
  let categoryName = "";
  let subcategoryName = "";

  try {
    if (slug.length === 1) {
      // Категорія
      const categoryData = await getCategory({
        slug: slug[0],
        page: 1, // для мета беремо першу сторінку або без пагінації
        searchParams: {}, // без фільтрів для мета
      });
      if (!categoryData?.category) return notFound();

      categoryName = categoryData.category.name;
      title = categoryData.category.meta_title ?? `${categoryName} – купити в інтернет-магазині`;
      description = categoryData.category.meta_description ?? `Широкий вибір товарів у категорії ${categoryName.toLowerCase()}. Доступні ціни, швидка доставка по Україні.`;
      keywords = categoryData.category.meta_keywords ?? `${categoryName}, купити, кросівки, вигідно, доставка`
    } else {
      // Підкатегорія
      const subcategoryData = await getSubcategory({
        slug: slug[1],
        page: 1,
        searchParams: {},
      });
      if (!subcategoryData?.subcategory) return notFound();

      const catData = await getCategory({ slug: slug[0], page: 1, searchParams: {} });

      subcategoryName = subcategoryData.subcategory.name;
      categoryName = catData?.category?.name || "";

      title =  subcategoryData.subcategory.meta_title ?? `${subcategoryName} – купити в ${categoryName.toLowerCase()}`;
      description =  subcategoryData.subcategory.meta_description ?? `Великий асортимент у підкатегорії ${subcategoryName}. Якісні товари за вигідними цінами в магазині.`;
      keywords = subcategoryData.subcategory.meta_keywords  ?? `${subcategoryName}, купити, кросівки, вигідно, доставка`
    }
  } catch (err) {
    return notFound()
  }
  return {
    title,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
      languages: {
        "uk-UA": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "StepHub",
      locale: "uk_UA",
      type: "website",
      // images: [{ url: "/og-category.jpg", width: 1200, height: 630 }], // додай реальний og-image
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: hasActiveFilters
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : {
          index: true,
          follow: true,
        },
  };
}

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
              
            {category.products && category.products.data.length > 0 
            ? <ListTemplate>
              {category.products.data.map((product) => (<div key={product.id}>
                {product && <ProductListCard product={product} />}
              </div>))}
            </ListTemplate>
            : <span>В даному розділі товарів ще немає!</span>
            }
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
        <div className="md:flex md:gap-5"> 
          <Filters type={subcategory.subcategory} />
          <div>              
            {subcategory.products && subcategory.products.data.length > 0 
            ? <ListTemplate>
              {subcategory.products.data.map((product) => (<div key={product.id}>
                {product && <ProductListCard product={product} />}
              </div>))}
            </ListTemplate>
            : <span>В даному розділі товарів ще немає!</span>
            }
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
