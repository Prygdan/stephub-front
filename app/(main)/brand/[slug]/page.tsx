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
import { Metadata } from "next";
import { hasActiveFilters } from "@/lib/utils";
import { Description } from "@/components/shared/description";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  if (typeof slug !== "string") {
    return notFound();
  }

  const filters = await loadSearchParams(searchParams);
  const page = filters.page || 1;
  const activeFilters = hasActiveFilters(filters, page);
  // Визначаємо, чи є активні фільтри (за тим самим принципом, що й раніше)
  const baseUrl = process.env.APP_URL || "https://your-domain.com";
  let canonical = `${baseUrl}/brand/${slug}`;
  if (page > 1) {
    canonical += `?page=${page}`;
  }

  let title = "";
  let description = "";
  let keywords = "";
  let brandName = "";

  try {
    // Отримуємо дані бренду без фільтрів і пагінації (для мета-даних)
    const brandData = await getBrandProducts({
      slug,
      page: 1,
      searchParams: {},
    });

    if (!brandData?.brand) {
      return notFound();
    }

    brandName = brandData.brand.name;

    // Використовуємо поля з бекенду, якщо вони є
    title =
      brandData.brand.meta_title ||
      `${brandName} – оригінальна продукція бренду в інтернет-магазині StepHub Lviv`;

    description =
      brandData.brand.meta_description ||
      `Оригінальні товари бренду ${brandName}. Широкий асортимент, актуальні ціни, швидка доставка по Україні.`;

    keywords =
      brandData.brand.meta_keywords ||
      `${brandName}, купити ${brandName.toLowerCase()}, оригінал, ${brandName.toLowerCase()} Україна, доставка`;
  } catch (err) {
    // Fallback, якщо щось пішло не так
    title = "Бренд – товари в інтернет-магазині";
    description = "Оригінальна продукція відомих брендів з доставкою по Україні";
    keywords = "бренд, оригінал, купити, доставка";
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
      // images: [{ url: "/og-brand.jpg", width: 1200, height: 630 }], // додай, якщо є
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: activeFilters
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

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    const { slug } = await params;
    const filters = await loadSearchParams(searchParams);

    const brand = await getBrandProducts({
      slug,
      page: filters.page,
      searchParams: filters,
    });

    if (!brand) return notFound();

    async function refetchBrandProducts() {
      "use server";
      revalidateTag("brand");
    }

    return (
      <Container>
        <div>
          {/* Header Page */}
          <h1 className="text-[23px] md:text-[28px] pt-5 pb-2 uppercase tracking-widest font-medium">
            {brand.brand.name}
          </h1>
          <Breadcrumbs
            items={[{ label: `${brand.brand.name}`, url: `${brand.brand.slug}` }]}
            className="flex justify-start pb-5"
          />
          {/* End Header Page */}

          {/* Content Page */}
          <div className="md:flex md:gap-5">
            <Filters type={brand.brand} />

            {brand.products && brand.products.data.length > 0 
            ? <ListTemplate>
                {brand.products.data.map((product) => (
                  <div key={product.id}>
                    {product && <ProductListCard product={product} />}
                  </div>
                ))}
              </ListTemplate>
            : <span>В даному розділі товарів ще немає!</span>}
          </div>

          {brand.products.last_page >= Number(process.env.NEXT_PUBLIC_PAGINATION_COUNT) && (
            <ProductsPagination
              refetchProducts={refetchBrandProducts}
              lastPage={brand.products.last_page}
              className="my-8"
            />
          )}
          {/* End Content Page */}
        </div>
        {brand.brand.description && 
          <Description
            description={brand.brand.description} 
            className='text-neutral-500 pt-10 pb-5'
            size="13" 
          />
        }
      </Container>
    );
  } catch (error: unknown) {
    return notFound();
  }
}