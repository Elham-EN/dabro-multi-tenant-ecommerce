import { useCartStore } from "../store/use-cart-store";
import { useCallback, useMemo } from "react";

export const useCart = (tenantSlug: string) => {
  const {
    getCartByTenant,
    addProduct,
    removeProduct,
    clearAllCarts,
    clearCart,
  } = useCartStore();

  const productIds = getCartByTenant(tenantSlug);

  const toggleProduct = useCallback(
    // Add and Remove
    (productId: string): void => {
      // if we have that product then remove it
      if (productIds.includes(productId)) {
        removeProduct(tenantSlug, productId);
      } else {
        // Otherwise add that product to cart
        addProduct(tenantSlug, productId);
      }
    },
    [productIds, tenantSlug, addProduct, removeProduct]
  );

  const isProductInCart = useCallback(
    (productId: string): boolean => {
      return productIds.includes(productId);
    },
    [productIds]
  );

  const clearTenantCart = useCallback((): void => {
    clearCart(tenantSlug);
  }, [tenantSlug, clearCart]);

  const addProductToCart = useCallback(
    (productId: string) => addProduct(tenantSlug, productId),
    [tenantSlug, addProduct]
  );

  const removeProductFromCart = useCallback(
    (productId: string) => removeProduct(tenantSlug, productId),
    [tenantSlug, removeProduct]
  );

  return useMemo(
    () => ({
      productIds,
      addProduct: addProductToCart,
      removeProduct: removeProductFromCart,
      clearCart: clearTenantCart,
      clearAllCarts,
      isProductInCart,
      totalItems: productIds.length,
      toggleProduct,
    }),
    [
      productIds,
      addProductToCart,
      removeProductFromCart,
      clearTenantCart,
      clearAllCarts,
      isProductInCart,
      toggleProduct,
    ]
  );
};
