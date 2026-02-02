'use client';

import React from 'react';
import * as ordersAPI from '@/services/orders';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InputCombobox, InputSelect, InputText, TextArea } from '@/components/shared/inputs';
import { handleChangePhone } from '@/lib/utils';
import { ProductPrice } from '@/components/shared/product-price/admin';
import { Button } from '@/components/ui/button';
import { Img } from '@/components/shared/img';
import { get as getAreas, TArea } from '@/services/delivery/areas';
import { show as showCities, TCiti } from '@/services/delivery/cities';
import { show as showBranches, TBranch } from '@/services/delivery/branches';
import { show as showPostomates, TPostomat } from '@/services/delivery/postomates';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { update, destroy } from '@/services/orders';
import { OrderStatusArray } from '@/lib/utils';
import { AxiosError } from 'axios';
import { OrderCard } from '@/components/shared/order-card';
import { TCartItem } from '@/hooks/use-cart';
import { TPatmentMethod } from '@/components/shared/checkout/payment-method';
import { CreditCard, PackageOpen } from 'lucide-react';
import { InputError } from '@/components/shared/input-error';

export default function Page() {
  const [orders, setOrders] = React.useState<ordersAPI.TOrderResponse[]>();
  const [order, setOrder] = React.useState<ordersAPI.TOrderResponse>();
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [status, setStatus] = React.useState<string>();

  const [name, setName] = React.useState<string>();
  const [surname, setSurname] = React.useState<string>('');
  const [middle_name, setMiddle_name] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [comment, setComment] = React.useState<string>('');
  const [area, setArea] = React.useState<string>('');
  const [areaRef, setAreaRef] = React.useState<string>('');
  const [city, setCity] = React.useState<string>('');
  const [cityRef, setCityRef] = React.useState<string>('');
  const [branch, setBranch] = React.useState<string | null>(null);
  const [branchRef, setBranchRef] = React.useState<string | null>(null);
  const [postomat, setPostomat] = React.useState<string | null>(null);
  const [postomatRef, setPostomatRef] = React.useState<string | null>(null);
  const [selectedArea, setSelectedArea] = React.useState<{ ref: string, name: string } | null>(null);
  const [selectedCity, setSelectedCity] = React.useState<{ ref: string, name: string } | null>(null);
  const [areas, setAreas] = React.useState<TArea[]>([]);
  const [cities, setCities] = React.useState<TCiti[]>([]);
  const [branches, setBranches] = React.useState<TBranch[]>([]);
  const [postomates, setPostomates] = React.useState<TPostomat[]>([]);
  const [isBranchSelected, setIsBranchSelected] = React.useState(false);
  const [isPostmatSelected, setIsPostmatSelected] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedPay, setSelectedPay] = React.useState<TPatmentMethod>();
  
  const fetch = async (page = 1) => {
    try {
      setLoading(true);
      const data = await ordersAPI.get(page);
      setOrders(data.data.data);
    } catch (error) {
      console.error("Помилка при завантаженні:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;
    setErrors({});

    const productsArray: TCartItem[] = order.items.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      price: item.product.price,
      size_id: item.size_id,
      quantity: item.quantity,
      slug: '', image: '', name: '', article: ''
    }));
    
    const orderData: ordersAPI.TOrderRequestUpdate = {
      name: name,
      surname: surname,
      middle_name: middle_name,
      phone: phone,
      comment: comment,
      area: area,
      area_ref: areaRef,
      city: city,
      city_ref: cityRef,
      branch: branch || undefined,
      branch_ref: branchRef || undefined,
      postomat: postomat || undefined,
      postomat_ref: postomatRef || undefined,
      status: status || '1',
      products: productsArray,
      payment_method: selectedPay
    };

    try {
      await update(order.id, orderData);
      setOpenEdit(false);
      fetch();
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.log('Unknown error updating order:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = (order: ordersAPI.TOrderResponse) => {
    setOpenEdit(true);
    setErrors({});
    order && setOrder(order);
    order.guest?.name && setName(order.guest?.name);
    order.guest?.surname && setSurname(order.guest?.surname);
    order.guest?.middle_name && setMiddle_name(order.guest?.middle_name);
    order.guest?.phone && setPhone(order.guest?.phone);
    order.comment && setComment(order.comment);
    order.guest?.area && setArea(order.guest?.area);
    order.guest?.city && setCity(order.guest?.city);
    order.guest?.branch && setBranch(order.guest?.branch);
    order.guest?.postomat && setPostomat(order.guest?.postomat);
    order.guest?.area_ref && setAreaRef(order.guest?.area_ref);
    order.guest?.city_ref && setCityRef(order.guest?.city_ref);
    order.guest?.branch_ref && setBranchRef(order.guest?.branch_ref);
    order.guest?.postomat_ref && setPostomatRef(order.guest?.postomat_ref);
    order.payment_method && setSelectedPay(order.payment_method);
    order.status && setStatus(order.status);
  }

  const handleDestroy = async (id: string) => {
    const confirmed = window.confirm("Ти впевнений, що хочеш видалити це замовлення?");
    if (!confirmed) return;
  
    try {
      await destroy(id);
      fetch();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 422)
        throw error;
    }
  }

  const fetchAreas = async () => {
    setLoading(true);
    const data = await getAreas();
    setLoading(false);
    setAreas(data.data.data);
  }

  const fetchCities = async (areaRef: string) => {
    setLoading(true);
    const data = await showCities(areaRef);
    setLoading(false);
    data && setCities(data);
  }

  const fetchBranches = async (cityRef: string) => {
    setLoading(true);
    const data = await showBranches(cityRef);
    setLoading(false);
    data && setBranches(data);
  }

  const fetchPostomates = async (cityRef: string) => {
    setLoading(true);
    const data = await showPostomates(cityRef);
    setLoading(false);
    data && setPostomates(data);
  }

  const handleSelectArea = (ref: string, name: string) => {
    setSelectedArea({ ref, name });
    setArea(name);
    setAreaRef(ref);
  };

  const handleSelectCities = (ref: string, name: string) => {
    setSelectedCity({ ref, name });
    setCity(name);
    setCityRef(ref);
  };

  const handleSelectBranch = (ref: string, name: string) => {
    setBranch(name);
    setBranchRef(ref);
  }

  const handleSelectPostomat = (ref: string, name: string) => {
    setPostomat(name);
    setPostomatRef(ref);
  }
  
  React.useEffect(() => {
    fetch();
  }, []);
  
  React.useEffect(() => {
    fetchAreas();
    order?.guest?.area_ref && fetchCities(order?.guest?.area_ref);
    order?.guest?.city_ref && fetchBranches(order?.guest?.city_ref);
    order?.guest?.city_ref && fetchPostomates(order?.guest?.city_ref);
  }, [order]);

  React.useEffect(() => {
    if(order?.guest?.branch) {
      setIsBranchSelected(true);
    } else if(order?.guest?.postomat) {
      setIsPostmatSelected(true);
    }
  }, [order, setIsBranchSelected, setIsPostmatSelected]);

  React.useEffect(() => {
    if (selectedArea) {
      fetchCities(selectedArea.ref);
    }
  }, [selectedArea]);

  React.useEffect(() => {
    if (selectedCity) {
      fetchBranches(selectedCity.ref);
      fetchPostomates(selectedCity.ref);
    }
  }, [selectedCity]);

  return <div>
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Відредагуйте дані</DialogTitle>
          </DialogHeader>
          <form>
              <span className='block uppercase text-[14px] font-bold tracking-wider'>Дані покупця</span>
              <div className='mt-1'>
                <div className='flex gap-2'>
                  <InputText
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    label={'Прізвище'}
                    name={'surname'}
                    errors={errors?.surname}
                    className='w-1/2'
                    required
                  />
                  <InputText
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label={'Ім\'я'}
                    name={'name'}
                    errors={errors?.name}
                    className='w-1/2'
                    required
                  />
                </div>
                <div className='flex gap-2 mt-4'>
                  <InputText
                    value={middle_name}
                    onChange={(e) => setMiddle_name(e.target.value)}
                    label={'По батькові'}
                    name={'middle_name'}
                    errors={errors?.middle_name}
                    className='w-1/2'
                  />
                  <InputText
                    value={phone}
                    onChange={(e) => handleChangePhone(e, setPhone)}
                    label={'Телефон'}
                    name={'phone'}
                    errors={errors?.phone}
                    className='w-1/2'
                    required
                  />
                </div>
              </div>
              <div>
                <span className='block uppercase text-[14px] mt-[40px] font-bold tracking-wider'>Доставка</span>
                {areas &&
                  <InputCombobox
                    label='Область'
                    name='area'
                    defaultValue={areaRef}
                    items={areas.map((area) => ({ value: area.ref, label: area.description }))}
                    onSelect={handleSelectArea}
                    placeholder='Оберіть область'
                    errors={errors?.area}
                    loading={loading}
                    required
                  />
                  }
                {cities && 
                  <InputCombobox
                    label='Місто'
                    name='city'
                    defaultValue={cityRef}
                    items={cities.map((citi) => ({ value: citi.ref, label: citi.description }))}
                    onSelect={handleSelectCities}
                    placeholder='Спочатку оберіть область'
                    errors={errors?.city}
                    className='mt-3'
                    loading={loading}
                    required
                  />}


              <div className='mt-4 font-light text-sm'>
                <div className='flex items-center gap-2'>
                  <Checkbox
                    id='branch'
                    checked={isBranchSelected}
                    onCheckedChange={(checked) => {
                      setIsBranchSelected(checked as boolean);
                      setIsPostmatSelected(false);
                      setPostomat(null);
                      setPostomatRef(null);
                    }}
                  />
                  <div className='flex items-center gap-1'>
                    <span><svg viewBox="0 0 18 19" fill="none" width="18px" height="18px"><path d="M10.394 14.154v-3.426H7.481v3.427H5.253l2.701 2.702a1.389 1.389 0 0 0 1.965 0l2.701-2.702h-2.226v-.001Zm-6.597-1.456V5.33L1.094 8.031a1.389 1.389 0 0 0 0 1.964l2.703 2.703Zm3.684-8.825V7.3h2.913V3.873h2.228L9.92 1.171a1.389 1.389 0 0 0-1.965 0L5.253 3.873h2.228Zm9.3 4.158-2.702-2.702v7.37l2.701-2.702a1.39 1.39 0 0 0 0-1.966Z" fill="#DA292B"></path></svg></span>
                    <Label htmlFor='branch' className='block'>Нова пошта відділення</Label>
                  </div>
                </div>

                {isBranchSelected && (
                  <InputCombobox
                    label='Відділення'
                    name='branch'
                    defaultValue={branchRef || ''}
                    items={branches.map((branch) => ({ value: branch.ref, label: branch.description }))}
                    onSelect={handleSelectBranch}
                    placeholder='Спочатку виберіть місто'
                    className='mt-5 pb-5'
                    labelClassName='font-light pb-1'
                    errors={errors?.branch}
                    loading={loading}
                    required
                  />
                )}

                <div className='mt-3 flex items-center gap-2'>
                  <Checkbox
                    id='postomat'
                    checked={isPostmatSelected}
                    onCheckedChange={(checked) => {
                      setIsPostmatSelected(checked as boolean);
                      setIsBranchSelected(false);
                      setBranch(null);
                      setBranchRef(null);
                    }}
                  />
                  <div className='flex items-center gap-1'>
                    <span><svg viewBox="0 0 18 19" fill="none" width="18px" height="18px"><path d="M10.394 14.154v-3.426H7.481v3.427H5.253l2.701 2.702a1.389 1.389 0 0 0 1.965 0l2.701-2.702h-2.226v-.001Zm-6.597-1.456V5.33L1.094 8.031a1.389 1.389 0 0 0 0 1.964l2.703 2.703Zm3.684-8.825V7.3h2.913V3.873h2.228L9.92 1.171a1.389 1.389 0 0 0-1.965 0L5.253 3.873h2.228Zm9.3 4.158-2.702-2.702v7.37l2.701-2.702a1.39 1.39 0 0 0 0-1.966Z" fill="#DA292B"></path></svg></span>
                    <Label htmlFor='postomat' className='block'>Нова пошта поштомат</Label>
                  </div>
                </div>

                {isPostmatSelected && (
                  <InputCombobox
                    label='Поштомат'
                    name='postomat'
                    defaultValue={postomatRef || ''}
                    items={postomates.map((postomat) => ({ value: postomat.ref, label: postomat.description }))}
                    onSelect={handleSelectPostomat}
                    errors={errors?.postomat}
                    placeholder='Спочатку виберіть місто'
                    className='mt-3'
                    labelClassName='font-light pb-1'
                    loading={loading}
                    required
                  />
                )}
              </div>

              <div>
                <span className='block uppercase text-[14px] mt-[40px] font-bold tracking-wider'>Оплата</span>

                <div className='mt-2'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <Checkbox
                        id='overpayment'
                        checked={selectedPay === 'overpayment'}
                        onCheckedChange={() => setSelectedPay('overpayment')}
                      />
                      <div className='flex items-center gap-1'>
                        <PackageOpen size={18} className='text-neutral-500' />
                        <Label htmlFor='overpayment' className='block'>Під час отримання товару</Label>
                      </div>
                    </div>
                  
                    <div className='mt-3 flex items-center gap-2'>
                      <Checkbox
                        id='card'
                        checked={selectedPay === 'card'}
                        onCheckedChange={() => setSelectedPay('card')}
                      />
                      <div className='flex items-center gap-1'>
                        <CreditCard size={18} className='text-neutral-500' />
                        <Label htmlFor='card' className='block'>На рахунок продавця</Label>
                      </div>
                    </div>
                  </div>
                  <InputError messages={errors.payment_method} />
                </div>
              </div>

              </div>
                <div className='mt-3'>
                  <TextArea
                    label='Коментар до замовлення'
                    name='comment'
                    value={comment}
                    onChange={(e) => setComment(e.target.value) }
                    errors={errors?.comment}
                  />
                </div>

                <span className='block uppercase text-[14px] mt-[40px] font-bold tracking-wider'>Кошик</span>
                <div className='mt-1'>
                  {order?.items.map((item, index) => (
                    <div key={item.id} className={`flex gap-2 mt-2 pt-2 ${index > 0 && 'border-t border-neutral-300'}`}>
                      <div className='w-1/5'>
                        <Img src={item.product.images![0].image} alt={item.product.name} />
                      </div>
                      <div className='w-full text-left'>
                        <span className='block'>{item.product.name}</span>
                        <span className='block text-xs text-neutral-400'>{item.product.article}</span>
                        
                        <div className='flex justify-between'>
                          <div className='flex items-center gap-1'>
                            <span className='text-[12px]'>Кількість:</span>
                            <span className='block'>{item.quantity} шт.</span>
                          </div>
                          <div>
                            <div className='flex items-center gap-1'>
                              <span className='text-[12px]'>Ціна:</span>
                              <ProductPrice product={item.product} />
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center gap-1'>
                          <span className='text-[12px]'>Розмір:</span>
                          <div className='text-xs flex flex-col items-center border border-green-800 px-1'>
                            {item.size && <span className='block'>{item.size.value_eu} EU</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='flex w-full gap-2'>
                  <InputSelect
                    label="Статус"
                    name="status"
                    value={status?.toString() || ''}
                    onChange={(value) => setStatus(value)}
                    selectItems={OrderStatusArray}
                    errors={errors.status}
                    className='w-full'
                  />
                </div>

              <div className='mt-8 mb-4 w-full'>
                <Button className='w-full' onClick={sendForm}>Зберегти</Button>
              </div>
            </form>
        </DialogContent>
    </Dialog>

    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
    {orders?.map((order) => (
      <OrderCard key={order.id} order={order} updateOrder={handleUpdate} destroy={handleDestroy} />
    ))}
    </div>
  </div>
}
