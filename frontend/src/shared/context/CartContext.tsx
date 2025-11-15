import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { CartItem, Product, ProductVariation, ProductAddon } from '@shared/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    variation: ProductVariation,
    addons: ProductAddon[],
    quantity: number
  ) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (
    product: Product,
    variation: ProductVariation,
    addons: ProductAddon[],
    quantity: number
  ) => {
    const addonsPrice = addons.reduce((sum, addon) => sum + addon.price, 0);
    const subtotal = (variation.price + addonsPrice) * quantity;

    const newItem: CartItem = {
      productId: product.id,
      product,
      variationId: variation.id,
      variation,
      addons,
      quantity,
      subtotal,
    };

    setItems([...items, newItem]);
  };

  const removeFromCart = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    const newItems = [...items];
    const item = newItems[index];
    const addonsPrice = item.addons.reduce((sum, addon) => sum + addon.price, 0);
    item.quantity = quantity;
    item.subtotal = (item.variation.price + addonsPrice) * quantity;
    setItems(newItems);
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const getItemsCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
