import { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "slug",
  },
  // auth: true,
  fields: [
    {
      name: "name",
      required: true,
      type: "text",
      label: "Store Name",
      admin: {
        description:
          "This is the name of the store (e.g. Boran's store)",
      },
    },
    {
      name: "slug", // Subdomain
      type: "text",
      index: true,
      required: true,
      unique: true,
      admin: {
        description:
          "This is the subdomain for the store (e.g. [slug].gumroad.com)",
      },
    },
    // Each store can store an image
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    // This ensure that the person who owns this tenant (store) has
    // verified their details with stripe
    {
      name: "stripeAccountId",
      type: "text",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    // Ensure whether the person passed that stripe verification or not
    {
      name: "stripeDetailsSubmitted",
      type: "checkbox",
      admin: {
        readOnly: true,
        description:
          "You cannot create products until you submit your stripe details",
      },
    },
  ],
};
