import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {
  const {
    getCartByTenant,
    addProduct,
    removeProduct,
    clearAllCarts,
    clearCart,
  } = useCartStore();

  const productIds = getCartByTenant(tenantSlug);

  // Add and Remove
  const toggleProduct = (productId: string): void => {
    // if we have that product then remove it
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      // Otherwise add that product to cart
      addProduct(tenantSlug, productId);
    }
  };

  const isProductInCart = (productId: string): boolean => {
    return productIds.includes(productId);
  };

  const clearTenantCart = (): void => {
    clearCart(tenantSlug);
  };

  return {
    productIds,
    addProduct: (productId: string) =>
      addProduct(tenantSlug, productId),
    removeProduct: (productId: string) =>
      removeProduct(tenantSlug, productId),
    clearCart: clearTenantCart,
    clearAllCarts,
    isProductInCart,
    totalItems: productIds.length,
    toggleProduct,
  };
};
