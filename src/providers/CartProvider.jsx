import React from 'react';
import { CartProvider as ReactUseCartProvider } from 'react-use-cart';
import { WishlistProvider } from 'react-use-wishlist';

export const CartProvider = ({ children }) => {
  return (
    <ReactUseCartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </ReactUseCartProvider>
  );
};