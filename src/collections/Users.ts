import type { CollectionConfig } from "payload";
// Import field helper that creates a relationship between Users and Tenants (stores)
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import { isSuperAdmin } from "@/lib/access";

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
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) return true;
      // Update your own account / profile
      return req.user?.id === id;
    },
  },
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => !isSuperAdmin(user),
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
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
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
