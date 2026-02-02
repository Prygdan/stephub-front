'use client';

import React from 'react';
import { Container } from '@/components/shared/container';
import { Cart } from '@/components/shared/cart/cart';
import { TCartItem } from '@/hooks/use-cart';

export default function CartClient() {
  const [cartData, setCartData] = React.useState<TCartItem[]>([]);
  const [clear, setClear] = React.useState<boolean>(false);

  const handleCart = (data: TCartItem[]) => {
    setCartData(data);
  }
  
  return <Container>
    <Cart onCartUpdate={handleCart} clear={clear} />
  </Container>
}