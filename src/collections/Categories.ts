import type { CollectionConfig } from "payload";

// A Collection is a group of records, called Documents that
// all share a common schema.

// Each Document in a Collection is stored in the Database based
// on the Fields that you define, and automatically generates a
// Local API used to manage your Documents

// t's often best practice to write your Collections in separate
// files and then import them into the main Payload Config.

// Fields are the building blocks of Payload. They define the schema
// of the Documents that will be stored in the Database

export const Categories: CollectionConfig = {
  // Unique, URL-friendly string that will act as an identifier
  // for this Collection.
  slug: "categories",
  admin: { useAsTitle: "name" },
  // Array of field types that will determine the structure and
  // functionality of the data stored within this Collection.
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      // We will query by this field
      unique: true,
      index: true,
    },
    {
      name: "color",
      type: "text",
    },
    // Categories collection is set up to create parent-child
    // relationships within the same collection.
    // "Men's Shoes" → parent is "Men's Clothing"
    // "Running Shoes" → parent is "Men's Shoes"
    {
      // The "parent" field: A category can have ONE parent category
      name: "parent",
      // Provides the ability to relate documents togethe
      type: "relationship",
      // Points to another record in the same categories collection
      relationTo: "categories",
      // Each category can only have one parent (not multiple parents)
      hasMany: false,
    },
    {
      // Shows all categories that have THIS category as their parent
      // "Men's Clothing" subcategories: ["Men's Shoes", "Men's Shirts"]
      name: "subcategories",
      type: "join",
      collection: "categories",
      // Find all categories where the parent field equals this category's ID"
      on: "parent",
      // Means a parent can have multiple children
      hasMany: true,
    },
  ],
};
// Two-way navigation:
// From child → find parent (using parent field)
// From parent → find all children (using subcategories join field)

// In This Project Context:
// This lets you create organized product categories where customers can browse
// from broad categories down to specific ones, perfect for your multi-tenant
// platform where each merchant might have different category structures!
