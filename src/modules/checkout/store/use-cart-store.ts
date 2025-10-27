// Import zustand - a simple state management library
import { create } from "zustand";
// Import middleware to save our cart data even after page refresh
import {
  persist,
  createJSONStorage,
} from "zustand/middleware";

// Define what a single tenant's cart looks like
interface TenantCart {
  // Store product IDs as a comma-separated string
  productIds: string[];
}

// Define the shape of our entire cart store
interface CartState {
  // Store multiple carts - one for each tenant (shop)
  // Record<string, TenantCart> means: tenant slug -> cart data
  tenantCarts: Record<string, TenantCart>;

  // Function to add a product to a specific tenant's cart
  addProduct: (
    tenantSlug: string, // Which shop's cart?
    productId: string // Which product to add?
  ) => void;

  // Function to remove a product from a specific tenant's cart
  removeProduct: (
    tenantSlug: string, // Which shop's cart?
    productId: string // Which product to remove?
  ) => void;

  // Function to clear all items from one tenant's cart
  clearCart: (tenantSlug: string) => void;

  // Function to clear all carts from all tenants
  clearAllCarts: () => void;

  // Function to get all product IDs for a specific tenant
  getCartByTenant: (tenantSlug: string) => string[];
}

// Create our cart store with Zustand
export const useCartStore = create<CartState>()(
  // Wrap our store with persist middleware to save data to localStorage
  persist(
    // Set and get are Zustand's built-in functions to update/read state
    (set, get) => ({
      // Start with an empty object - no carts yet
      tenantCarts: {},

      // Add a product to a specific tenant's cart
      addProduct: (tenantSlug, productId) =>
        // Update the state immutably (without changing the original)
        set((state) => ({
          // Create a new tenantCarts object
          tenantCarts: {
            // Copy all existing tenant carts
            ...state.tenantCarts,
            // Update or create the cart for this specific tenant
            [tenantSlug]: {
              productIds: [
                // Get existing products (or empty array if cart is new)
                ...(state.tenantCarts[tenantSlug]
                  ?.productIds || []),
                // Add the new product to the end
                productId,
              ],
            },
          },
        })),
      // Filtering out the product id from the specific tenant cart
      removeProduct: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds:
                state.tenantCarts[
                  tenantSlug
                ]?.productIds.filter(
                  (id) => id !== productId
                ) || [],
            },
          },
        })),

      // Remove all the products from specific tenant cart
      clearCart: (tenantSlug: string) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds: [],
            },
          },
        })),
      // Remove all product from all the tenant cart
      clearAllCarts: () =>
        set({
          tenantCarts: {},
        }),

      getCartByTenant: (tenantSlug: string) =>
        get().tenantCarts[tenantSlug]?.productIds || [],
    }),
    // Configuration for how to persist the data
    {
      // Name of the key in localStorage
      name: "dabro-cart",
      // Use browser's localStorage to save the cart
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Tenant Cart Logic Explained:
 *
 * ...state.tenantCarts preserves all other tenant carts
 * [tenantSlug]: dynamically creates or updates just one specific tenant's cart
 * || [] ensures we always have an array, even for new tenants
 * ...( ) spreads existing items so we don't lose them
 * Adding productId appends the new product to the array
 *
 * This pattern ensures immutability (no direct mutations) which is important for
 * React and Zustand to detect changes properly!
 *
 * Real-World Example
 * Let's say you have two shops (tenants): "johns-shop" and "marys-shop"
 *
 * Scenario 1: Starting from scratch (empty cart)
 * 
 * Initial state: tenantCarts: {} - empty object
 * 
 * User adds product "product-123" to "johns-shop"
 * addProduct("johns-shop", "product-123")
 * 
 * Step-by-step breakdown:
 * state.tenantCarts["johns-shop"]  // undefined (doesn't exist yet)
 * /?.productIds // undefined
 * || [] // Fallback to empty array: []
 * ...[] // Spread empty array (nothing)
 * productId // "product-123"
 * 
 * Final result:
 * ["product-123"]
 * 
 * New state becomes:
 *  tenantCarts: {
      "johns-shop": {
        productIds: ["product-123"]
      }
    }
 */
