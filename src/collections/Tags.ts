import { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: { useAsTitle: "name" },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      // One Tag can have MANY Products
      // Tag: "Electronics" → Products: [iPhone, Laptop, Headphones]
      hasMany: true,
    },
  ],
};
