import type { CollectionConfig } from "payload";
// Import field helper that creates a relationship between Users and Tenants (stores)
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";

// Creates an array field that links this user to multiple tenants
// (stores they own/access)
// Example: A user can own "john-store" and "jane-store" → tenants:
// [{tenant: "john-store"}, {tenant: "jane-store"}]
const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    // Email added by default
    // Field to store a unique username for each user
    {
      name: "username",
      required: true,
      unique: true,
      type: "text",
    },
    // Creates a multi-select dropdown for user roles
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      // New users automatically get "user" role
      defaultValue: ["user"],
      // User can have MULTIPLE roles (e.g., both "admin" and "user")
      hasMany: true,
      // Available roles to choose from
      options: ["super-admin", "user"],
    },
    // Add the tenants array field - determines which stores this
    // user can access/manage
    {
      ...defaultTenantArrayField,
      admin: {
        // If defaultTenantArrayField.admin exists → spread its properties
        // If it's undefined → spread empty object {}
        ...(defaultTenantArrayField.admin || {}),
        position: "sidebar",
      },
    },
  ],
};
