'use client';

import React from 'react';
import Link from 'next/link';
import * as API from '@/services/products';
import { Title } from "@/components/shared/title";
import { usePaginatedCrud } from '@/hooks/use-paginated-crud';
import { isAllowed, isSize, revalidateRelatedCache } from '@/lib/utils';
import { Loading } from '@/components/shared/loading';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useBrands } from '@/hooks/filters/use-brands';
import { TSubcategory } from '@/services/subcategories';
import { useSeasons } from '@/hooks/filters/use-seasons';
import { useMaterials } from '@/hooks/filters/use-matirials';
import { useCategories } from '@/hooks/filters/use-categories';
import { useSubcategories } from '@/hooks/filters/use-subcategories';
import { DialogForm } from '@/components/shared/dialog-form';
import { InputCheckbox, InputSelect, InputText } from '@/components/shared/inputs';
import { Label } from '@/components/ui/label';
import { Tiptap } from '@/components/ui/tiptap/tiptap';
import { MetaTagsForm } from '@/components/shared/meta-tags/meta-tags-form';
import { InputError } from '@/components/shared/input-error';
import { AnimationMultiSelect } from '@/components/shared/product-multi-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PenLine, Trash2 } from 'lucide-react';
import { MetaTagsShow } from '@/components/shared/meta-tags/meta-tags-show';
import { ProductPrice } from '@/components/shared/product-price/admin';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Img } from '@/components/shared/img';
import { ProductSizes } from '@/components/shared/product-sizes';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/shared/list/pagination';

export default function Page() {
  const defaultProduct: API.TProduct = {
    id: '', slug: '',
    category_id: '',  subcategory_id: '', season_id: '', material_id: '', brand_id: '',
    name: '', article: '', description: '',
    sizes: [],
    price: Number(), discount: Number(),
    is_active: true
  };

  /**
   * Paginated CRUD hook for admin entities.
   * Handles modal state, validation errors and pagination.
   */
  const { 
    pagination, items, item, setItem, create, update,
    loading, open, openModal, closeModal, destroy, errors
  } = usePaginatedCrud<API.TProduct>(API, defaultProduct);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [ selectedSubcategory, setSelectedSubcategory ] = React.useState<TSubcategory | null>(null);
  const [ selectedSizes, setSelectedSizes ] = React.useState<string[]>([]);
  const [ subcategoriesByCategory, setSubcategoriesByCategory ] = React.useState<TSubcategory[]>([]);
  const [ loadingProduct, setLoadingProduct ] = React.useState(false);

  const { brands, loading: loadingBrands } = useBrands(
    selectedSubcategory ? isAllowed({filter: 'brands', subcategory: selectedSubcategory}) : false
  );
  const { seasons, loading: loadingSeasons } = useSeasons(
    selectedSubcategory ? isAllowed({filter: 'seasons', subcategory: selectedSubcategory}) : false
  );
  const { materials, loading: loadingMaterials } = useMaterials(
    selectedSubcategory ? isAllowed({filter: 'materials', subcategory: selectedSubcategory}) : false
  );
  const { categories, loading: loadingCategories } = useCategories(true);
  const { subcategories, loading: loadingSubcategories } = useSubcategories(true);

  const slugFromQuery = searchParams.get("edit-slug");

  /**
   * Function make request for save or update product
   * @param e React Form Evaent
   */
  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedItem = { ...item, sizes: selectedSizes }
    if (item.slug) {
      const response = await update(updatedItem, item.slug);
      cleanSelected();
      response && revalidateRelatedCache({
        categories: true, subcategories: true, products: true, brands: true 
      })
    } else {
      const response: API.TProduct | undefined = await create(updatedItem);
      cleanSelected();
      response && router.push(`/admin/products/${response.slug}`);
      response && revalidateRelatedCache({
        categories: true, subcategories: true, products: true, brands: true
      })
    }
  };

  const cleanSelected = () => {
    setSelectedSizes([]);
  }

  const handleCloseModal = () => {
    closeModal();
    setSelectedSubcategory(null);
    cleanSelected();
    clearSearchParams();
  };

  /**
   * Set slected sizes in multiple select for update
   */
  React.useEffect(() => {
    if (item.sizes && item.sizes.length > 0) {
      setSelectedSizes(item.sizes.map((i) => isSize(i) ? i.id : ''));
    }
  }, [item.sizes]);  

  React.useEffect(() => {
    if(open && item.subcategory_id && subcategories.length) {
      setSubcategoriesByCategory(subcategories.filter((subcategory) => subcategory.category_id == item.category_id));
      const sub = subcategories.find(s => s.id == item.subcategory_id);
      sub && setSelectedSubcategory(sub);
    }
  }, [open, subcategories, item]);

  /**
   * Update Product From show page
   */
  const fetchProduct = async (slug: string) => {
    try {      
      setLoadingProduct(true);
      const response = await API.show(slug);
      if(response.status == 200) {
        openModal(response.data);
        setItem(response.data);
      }
    } catch (error) {
      console.log('Loading product: ' + error);
    } finally {
      setLoadingProduct(false);
    }
  }

  /**
   * Remove all Query Params in URL
   * @returns void
   */
  const clearSearchParams = () => {
    router.replace(pathname);
  };

  React.useEffect(() => {
    slugFromQuery && fetchProduct(slugFromQuery);
  }, [slugFromQuery])

  /**
   * Function for generate product article
   */
  const generateArticle = (): string => {
    const letters = Array.from({ length: 4 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');
  
    const timestamp = Date.now().toString().slice(-4);
  
    return `${letters}-${timestamp}`;
  };

  /** 
   * Set article by product name
   */
  React.useEffect(() => {
    const article = generateArticle();
    setItem({ ...item, article: article })
  }, [item.name])

  if(loading) return <Loading />

  return <div>
    <Title text='Список товарів' size='xl' className='uppercase' />
    <DialogForm
      name='Товар' 
      open={open} 
      openModal={openModal} 
      closeModal={handleCloseModal} 
      item={item} 
      sendForm={sendForm}
      className='relative w-full'
      formClassName='min-w-[100%] min-h-[90%]'
      >
        {loadingProduct 
          && <Loading className='absolute left-0 top-0 w-full h-full bg-red-200'/>}
      <InputCheckbox
        label='Активний'
        name='is_active'
        value={item.is_active}
        onChange={(e) => setItem({ ...item, is_active: Boolean(e)})}
        errors={errors.is_active}
      />
      <div className='md:flex gap-5'>
        <InputSelect
          label="Категорія товару"
          name="category_id"
          value={item.category_id}
          onChange={(value) => {
            setItem({ ...item, category_id: value });
            setSubcategoriesByCategory(subcategories.filter((subcategory) => subcategory.category_id == value));
          }}
          selectItems={categories}
          errors={errors.category_id}
          className='mb-4 md:max-w-1/2 md:mb-0'
          loading={loadingCategories}
          required
        />
        <InputSelect
          label="Підкатегорія товару"
          name="subcategory_id"
          value={item.subcategory_id}
          onChange={(value) => {
            setItem({ ...item, subcategory_id: value })
            setSelectedSubcategory(subcategories.find((subcategory) => subcategory.id == value) ?? null)
          }}
          selectItems={subcategoriesByCategory ?? []}
          errors={errors.subcategory_id}
          className='mb-4 md:max-w-1/2 md:mb-0'
          placeholder={subcategoriesByCategory?.length <= 0 ? 'Спочатку виберіть основну категорію' : ''}
          loading={loadingSubcategories}
          required
        />
      </div>

      <div className="md:flex gap-5">
        <InputText
          type='text'
          label='Назва товару'
          name='name'
          value={item.name}
          onChange={(e) => setItem({ ...item, name: e.target.value })}
          errors={errors.name}
          className="w-full mb-4 md:mb-0"
          required
        />
        <InputText
          type='text'
          label='Артикул товару'
          name='article'
          value={item.article}
          onChange={(e) => setItem({ ...item, article: e.target.value })}
          errors={errors.article}
          required
        />
      </div>
      
      {/* Price */}
      <div className='md:flex gap-5'>
        <InputText
          label='Ціна товару'
          name='price'
          value={item.price}
          onChange={(e) => {
            const parsedValue = parseFloat(e.target.value);
            setItem({ ...item, price: isNaN(parsedValue) ? 0 : parsedValue });
          }}
          errors={errors.price}
          placeholder='Ціна товару'
          className='md:w-1/2 mb-4 md:mb-0'
          required
        />
        <InputText
          label='Знижка %'
          text='20%'
          name='discount'
          value={item.discount}
          onChange={(e) => {
            const parsedValue = parseFloat(e.target.value);
            setItem({ ...item, discount: isNaN(parsedValue) ? 0 : parsedValue });
          }}
          errors={errors.discount}
          placeholder='Заголовок'
          className='mb-4 md:w-1/2 md:mb-0'
        />
        {item.price > 0 && item.discount && item.discount > 0 && (
          <div className="text-sm text-green-700 ml-1">
            🔻 Фінальна ціна: <b>{(item.price * (1 - item.discount / 100)).toFixed(2)} грн</b>
          </div>
        )}
      </div>

      <div className="md:grid md:grid-cols-2 gap-5">
        {selectedSubcategory && isAllowed({filter: 'brands', subcategory: selectedSubcategory}) && <InputSelect
          label="Бренд"
          name="brand_id"
          value={item.brand_id}
          onChange={(value) => {
            setItem({ ...item, brand_id: value })
          }}
          selectItems={brands ? brands : []}
          errors={errors.brand_id}
          loading={loadingBrands}
        />}
        {selectedSubcategory && isAllowed({filter: 'seasons', subcategory: selectedSubcategory}) && <InputSelect
          label="Сезон"
          name="season_id"
          value={item.season_id}
          onChange={(value) => {
            setItem({ ...item, season_id: value })
          }}
          selectItems={seasons ? seasons : []}
          errors={errors.season_id}
          loading={loadingSeasons}
        />}
        {selectedSubcategory && isAllowed({filter: 'materials', subcategory: selectedSubcategory}) && <InputSelect
          label="Матеріал"
          name="material_id"
          value={item.material_id}
          onChange={(value) => {
            setItem({ ...item, material_id: value })
          }}
          selectItems={materials ? materials : []}
          errors={errors.material_id}
          loading={loadingMaterials}
        />}
      </div>

      <AnimationMultiSelect
        name="sizes"
        label="Розміри"
        type="sizes"
        selected={selectedSizes}
        setSelected={setSelectedSizes}
        errors={errors.sizes}
      />

      <Label>Опис товару</Label>
      <Tiptap
        value={item.description}
        onChange={(val) => setItem({ ...item, description: val })}
      />
      <InputError messages={errors.description}/>

      <MetaTagsForm
        item={item}
        setItem={(value) => setItem({ ...item, ...value })}
        errors={errors}
      />
    </DialogForm>

    <div className='mt-3'> 
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Фото</TableHead>
            <TableHead>Назва</TableHead>
            <TableHead>
              <span className="block">Категорія / Підкатегорія</span>
              <span className="block">Сезон / Матеріал</span>
            </TableHead>
            <TableHead>Бренд</TableHead>
            <TableHead>Розміри</TableHead>
            <TableHead>Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Link href={`/admin/products/${item.slug}`}>
                <span>{item.id}</span>
                {/* <hr />
                <div className="flex gap-1 items-center">
                  <span className="block text-[14px]">{item.views?.count}</span>
                  <Eye size={16} className="block" />
                </div> */}
                <hr />
                <span>{item.article}</span>
              </Link>
              <hr />
              <MetaTagsShow
                title={item.meta_title ?? ''}
                description={item.meta_description ?? ''}
                keywords={item.meta_keywords ?? ''}
                className='mt-1.5'
              />
            </TableCell>
            <TableCell>
              {item.images && item.images?.length > 0 &&                   
              <Carousel className='relative'>
                <Link href={`/admin/products/${item.slug}`}>
                  <CarouselContent className='w-37.5'>
                    {item.images?.slice(0,3).map((i) => (<CarouselItem key={i.id}>
                      <Img src={i.image} alt={item.name} width={100}/>
                    </CarouselItem>))}
                  </CarouselContent>
                </Link>
                <CarouselPrevious className='absolute left-0' />
                <CarouselNext className='absolute right-0' />
              </Carousel>}
            </TableCell>
            <TableCell>
              <Link href={`/admin/products/${item.slug}`}>
                <div className='whitespace-normal wrap-break-word max-w-65'>
                  {item.name}
                </div>
                <ProductPrice product={item} className='mt-3' />
              </Link>
            </TableCell>
            <TableCell>
              <span>{item.category?.name}</span>
              {item.subcategory && <>
                <hr />
                <span>{item.subcategory?.name}</span>
              </>}
              {item.season && <><hr /><span>{item.season.name}</span></>}
              {item.material && <><hr /><span>{item.material.name}</span></>}
            </TableCell>
            <TableCell> 
              {item.brand && <div>
                {item.brand.image && 
                  <Img src={item.brand.image} alt={item.brand.name} className='max-w-12.5' />}
                <span>{item.brand.name}</span>
              </div>}
            </TableCell>
            <TableCell>
              <ProductSizes product={item} />
            </TableCell>
            <TableCell className='flex'>
              <Button size='sm' title='Редагувати' className='mr-1' onClick={() => openModal(item)}>
                <PenLine />
              </Button>
              <Button size='sm' title='Видалити' onClick={() => {
                  destroy(item.slug ?? '');
                  revalidateRelatedCache({categories: true, subcategories: true, products: true})
                  }}>
                <Trash2 />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </div>        

    {pagination.total >= Number(process.env.NEXT_PUBLIC_PAGINATION_COUNT) && 
      <Pagination lastPage={pagination.last_page} className="mt-8 pb-8" />
    }
  </div>
}