import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",

  admin: {
    useAsTitle: "name",
  },

  fields: [
    {
      name: "name",
      type: "text",
      required: true, // Every order must have a name for identification
    },
    {
      // Links this order to the user who made the purchase
      // Establishes a many-to-one relationship: many orders can belong to one user
      name: "user",
      type: "relationship",
      relationTo: "users", // References the Users collection
      required: true, // Every order must be associated with a user
      hasMany: false, // Each order belongs to exactly one user (not multiple)
    },
    {
      // Links this order to the product that was purchased
      // Establishes a many-to-one relationship: many orders can be for the same product
      name: "product",
      type: "relationship",
      relationTo: "products", // References the Products collection
      required: true, // Every order must have a product
      hasMany: false, // Each order is for exactly one product (not multiple products)
    },
    {
      // Stores the unique Stripe Checkout Session ID from the payment gateway
      // Used to track the payment status and link to Stripe's payment records
      // Critical for webhook verification, refunds, and payment reconciliation
      name: "stripeCheckoutSessionId",
      type: "text",
      required: true, // Every order must have a Stripe session ID to verify payment
    },
  ],
};
