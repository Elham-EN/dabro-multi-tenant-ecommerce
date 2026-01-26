import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";
import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) return true;
      const tenant = req.user?.tenants?.[0]
        .tenant as Tenant;
      // Restricted tenants from creating product unless
      // they have submitted their stripe details
      return Boolean(tenant?.stripeDetailsSubmitted);
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
    },
    {
      name: "price",
      type: "number",
      required: true,
      admin: {
        description: "Price in AUD",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      // One product can only belong to category
      hasMany: false,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      // one product can be tagged with multiple tags
      // Example: iPhone → ["Electronics", "Bestseller", "Premium", "Apple"]
      hasMany: true,
    },

    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: [
        "30-day",
        "14-day",
        "7-day",
        "3-day",
        "1-day",
        "no-refunds",
      ],
      defaultValue: "30-day",
    },
    {
      name: "content",
      type: "textarea",
      admin: {
        description:
          "Protected content only visible to customers after purchase. Add product doc, downloadable files, getting started guides and bonus materials.",
      },
    },
  ],
};
