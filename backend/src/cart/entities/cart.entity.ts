export class Cart {
  id: number;
  userId?: number;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export class CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
