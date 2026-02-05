'use client';

import React from "react";
import * as categoriesAPI from '@/services/categories';
import * as subcategoriesAPI from '@/services/subcategories';
import { useCrud } from "@/hooks/use-crud";
import { Loading } from "@/components/shared/loading";
import { Title } from "@/components/shared/title";
import { DialogForm } from "@/components/shared/dialog-form";
import { InputCheckbox, InputSelect, InputText, TextArea } from "@/components/shared/inputs";
import { MetaTagsForm } from "@/components/shared/meta-tags/meta-tags-form";
import { Button } from "@/components/ui/button";
import { MetaTagsShow } from "@/components/shared/meta-tags/meta-tags-show";
import { PenLine, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ALL_FILTERS, revalidateRelatedCache } from "@/lib/utils";

export default function Page() {
  const defaultCategory: categoriesAPI.TCategory = {
    id: '',
    name: '',
    slug: '',
    description: '',
    allowed_filters: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  };

  const defaultSubcategory: subcategoriesAPI.TSubcategory = {
    id: '',
    category_id: '',
    name: '',
    slug: '',
    description: '',
    allowed_filters: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  };

  const { 
    fetch: categoryFetch,
    items: categoryItems,
    item: categoryItem,
    setItem: setCategoryItem,
    create: createCategory,
    update: updateCategory,
    loading: categoryLoading,
    open: categoryOpen,
    openModal: openCategoryModal,
    closeModal: closeCategoryModal,
    destroy: destroyCategory,
    errors: categoryErrors
  } = useCrud<categoriesAPI.TCategory>(categoriesAPI, defaultCategory);

  const { 
    items: subItems,
    item: subItem, 
    setItem: subSetItem, 
    create: subCreate, 
    update: subUpdate, 
    loading: subLoading, 
    open: subOpen, 
    openModal: subOpenModal, 
    closeModal: subCloseModal, 
    destroy: subDestroy,
    errors: subErrors
  } = useCrud<subcategoriesAPI.TSubcategory>(subcategoriesAPI, defaultSubcategory);

  const sendCategoryForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const newItem = { ...categoryItem };

    if (categoryItem.slug) {
      const response = await updateCategory(newItem, categoryItem.slug);
      response && revalidateRelatedCache({categories: true, subcategories: true})
    } else {
      const response = await createCategory(newItem);
      response && revalidateRelatedCache({categories: true, subcategories: true})
    }
  }

  const sendSubCategoryForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const newItem = { ...subItem };

    if (subItem.slug) {
      const response = await subUpdate(newItem, subItem.slug);
      response && revalidateRelatedCache({categories: true, subcategories: true})
      categoryFetch();
    } else {
      const response = await subCreate(newItem);
      response && revalidateRelatedCache({categories: true, subcategories: true})
      categoryFetch();
    }
  }

  const handleCloseModal = () => {
    closeCategoryModal();
    subCloseModal();
  };

  if (categoryLoading || subLoading) return <Loading />;

  return <div>
    <Title text='Меню сайту' size='xl' className='uppercase' />

    <div className='flex gap-3'>
      {/* FROM FOR CATEGORY */}
      <DialogForm name='Категорія' open={categoryOpen} openModal={openCategoryModal} closeModal={handleCloseModal} item={categoryItem} sendForm={sendCategoryForm}>
        <InputText
          label='Назва'
          name='name'
          value={categoryItem.name}
          onChange={(e) => setCategoryItem({ ...categoryItem, name: e.target.value })}
          errors={categoryErrors.name}
          placeholder='Для дівчат'
          required
        />
        <TextArea
          label='Опис' 
          name='description'
          value={categoryItem.description ? categoryItem.description : ''}
          onChange={(e) => setCategoryItem({ ...categoryItem, description: e.target.value })}
          errors={categoryErrors.description}
        />
        <MetaTagsForm
          item={categoryItem} 
          setItem={(val) => setCategoryItem({ ...categoryItem, ...val })}
          errors={categoryErrors}
          />
        <div className='mt-1'>
          <Label className='mb-2'>Пункти фільтрації</Label>
          <div className='grid grid-cols-3 gap-2'>
            {ALL_FILTERS.map((filter) => (<div key={filter.value}>
              <InputCheckbox
                label={filter.label}
                name={filter.value}
                value={categoryItem.allowed_filters?.includes(filter.value) ?? false}
                onChange={(e) => {
                  if(e) {
                    setCategoryItem({
                      ...categoryItem,
                      allowed_filters: [...(categoryItem.allowed_filters || []), filter.value]
                    })
                  } else {
                    setCategoryItem({
                      ...categoryItem,
                      allowed_filters: categoryItem.allowed_filters?.filter((f) => f !== filter.value) ?? ['']
                    })
                  }
                }}
                errors={categoryErrors.allowed_filters}
              />
            </div>))}
          </div>
        </div>
      </DialogForm>

      {/* FORM TO SUBCATEGORY */}
      <DialogForm name='Підкатегорія' open={subOpen} openModal={subOpenModal} closeModal={handleCloseModal} item={subItem} sendForm={sendSubCategoryForm}>
        <InputSelect
          label="Основна категорія"
          name="category_id"
          value={subItem.category_id ?? ''}
          onChange={(value) => subSetItem({ ...subItem, category_id: value })}
          selectItems={categoryItems}
          errors={subErrors.category_id}
          placeholder="Оберіть категорію"
          className="w-full"
        />
        <InputText
          label='Назва'
          name='name'
          value={subItem.name}
          onChange={(e) => subSetItem({ ...subItem, name: e.target.value })}
          errors={subErrors.name}
          placeholder='Кросівки'
        />
        <TextArea
          label='Опис' 
          name='description'
          value={subItem.description ? subItem.description : ''}
          onChange={(e) => subSetItem({ ...subItem, description: e.target.value })}
          errors={subErrors.description}
        />
        <MetaTagsForm 
          item={subItem} 
          setItem={(val) => subSetItem({ ...subItem, ...val })}
          errors={subErrors}
          />
        <div className='mt-1'>
          <Label className='mb-2'>Пункти фільтрації</Label>
          <div className='grid grid-cols-3 gap-2'>
            {ALL_FILTERS.map((filter) => (<div key={filter.value}>
              <InputCheckbox
                label={filter.label}
                name={filter.value}
                value={subItem.allowed_filters?.includes(filter.value) ?? false}
                onChange={(e) => {
                  if(e) {
                    subSetItem({
                      ...subItem,
                      allowed_filters: [...(subItem.allowed_filters || []), filter.value]
                    })
                  } else {
                    subSetItem({
                      ...subItem,
                      allowed_filters: subItem.allowed_filters?.filter((f) => f !== filter.value) ?? ['']
                    })
                  }
                }}
                errors={subErrors.allowed_filters}
              />
            </div>))}
          </div>
        </div>
      </DialogForm>
    </div>

    <div className='w-full mt-3'> 
      {categoryItems.length > 0 
      ? 
      <div>
        {/* Categories render */}
        {categoryItems.map((category) => (<div key={category.id} className='relative border p-4 rounded-xl shadow-sm space-y-3 mb-5'>
          <div className='w-full flex'>
            <div>
              <div>{category.name}</div>
              {category.description && <div className="text-sm text-gray-600">Опис: {category.description}</div>}
              <MetaTagsShow
                title={category.meta_title ?? ''}
                description={category.meta_description ?? ''}
                keywords={category.meta_keywords ?? ''}
              />
              {category.allowed_filters && category.allowed_filters.length > 0 && 
              <div className="text-sm text-gray-600 flex items-center flex-wrap gap-2 mt-2">
                <div className="text-sm text-gray-600">Фільтри:</div>
                {category.allowed_filters?.map((filterValue) => {
                  const item = ALL_FILTERS.find((el) => (filterValue === el.value))

                  return (
                    <span
                      key={filterValue}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs border"
                    >
                      {item?.label ?? filterValue}
                    </span>
                  );
                })}
              </div>}
            </div>
          </div>

              {/* Subcategories render */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="list-decimal pl-5 space-y-2">
              {category.subcategories.map((sub) => (
                <div key={sub.id}>
                  <div className='flex gap-5 w-full'>
                    <div className="flex items-center gap-4 w-full">
                      <div className='flex gap-1 justify-between w-full'>
                        <div>
                          <div className="font-medium">{sub.name}</div>
                          {sub.description && <div className="text-sm text-gray-600">Опис: {sub.description}</div>}
                          {sub.allowed_filters && sub.allowed_filters.length > 0 && <div className="text-sm text-gray-600 flex items-center flex-wrap gap-2 mt-2">
                            <div className="text-sm text-gray-600">Фільтри:</div>
                            {sub.allowed_filters?.map((subfilterValue) => {
                              const subItem = ALL_FILTERS.find((el) => (subfilterValue === el.value))

                              return (
                                <span
                                  key={subfilterValue}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs border"
                                >
                                  {subItem?.label ?? subfilterValue}
                                </span>
                              );
                            })}
                          </div>}

                          <MetaTagsShow 
                            title={sub.meta_title ?? ''}
                            description={sub.meta_description ?? ''}
                            keywords={sub.meta_keywords ?? ''}
                            className='mt-1.5'
                          />
                        </div>
                        {sub && <div>
                          <Button size='sm' title='Редагувати' className='mb-1' onClick={() => subOpenModal(sub)}><PenLine /></Button>
                          <Button size='sm' title='Видалити' onClick={() => subDestroy(sub.slug)}><Trash2 /></Button>
                        </div>
                        }
                      </div>
                    </div>
                  
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className='absolute right-3 top-3'>
            <Button size={'sm'} title='Редагувати' className='mr-1' onClick={() => openCategoryModal(category)}><PenLine /></Button>
            <Button size={'sm'} title='Видалити' onClick={() => destroyCategory(category.slug)}><Trash2 /></Button>
          </div>
        </div>))}
      </div>
      : <span>Записи відсутні</span>
      }
    </div>
  </div>
}