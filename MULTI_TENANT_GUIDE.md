# Multi-Tenant Plugin Explained

## What is a Tenant?

A **tenant** is like having separate, isolated stores within one platform. Think of it like a shopping mall:

- **The Mall** = Your platform (Dabro)
- **Individual Stores** = Tenants (e.g., "Bob's Digital Art Store", "Sarah's Music Shop")

Each tenant has:
- Their own storefront (subdomain like `bob.dabro.com`)
- Their own products
- Their own Stripe account to receive payments
- Complete data isolation from other tenants

**Real-World Example:**
```
Platform: dabro.com

Tenants:
├── bob.dabro.com (Bob's store with his digital art)
├── sarah.dabro.com (Sarah's store with her music)
└── alex.dabro.com (Alex's store with his ebooks)
```

## What is the Multi-Tenant Plugin?

The `@payloadcms/plugin-multi-tenant` plugin **automatically isolates data** between different tenants. Without it, you'd see everyone's products mixed together!

### What It Does For You

**Without the plugin:**
```
Products Collection:
- Product 1 (Bob's)
- Product 2 (Sarah's)
- Product 3 (Bob's)
- Product 4 (Alex's)

❌ Bob sees ALL products, including Sarah's and Alex's!
```

**With the plugin:**
```
When Bob logs in → Only sees his products
When Sarah logs in → Only sees her products
When Alex logs in → Only sees his products

✅ Automatic data isolation!
```

### Configuration in Your Project

Looking at your `src/payload.config.ts`:

```typescript
multiTenantPlugin({
  collections: {
    products: {},  // Products are scoped to tenants
  },
  userHasAccessToAllTenants: (user) =>
    Boolean(user.roles?.includes("super-admin")),
})
```

This means:
- **Products** are automatically filtered by tenant
- Only users with `super-admin` role can bypass this filtering

## What is the Super-Admin Role?

The **super-admin** is the platform owner (you!) who needs to see and manage everything across all tenants.

### Role Comparison

| Feature | Regular User (Tenant Owner) | Super Admin (Platform Owner) |
|---------|---------------------------|------------------------------|
| Can see own products | ✅ Yes | ✅ Yes |
| Can see other tenant's products | ❌ No | ✅ Yes |
| Can manage all tenants | ❌ No | ✅ Yes |
| Can access platform analytics | ❌ No | ✅ Yes |
| Use case | Store owner managing their shop | Platform owner managing entire marketplace |

### Example Scenario

**Bob's View (Regular Tenant Owner):**
```
Visits Payload Admin → Sees only:
- His tenant: "Bob's Digital Art"
- His 5 products
- His orders
```

**Your View (Super Admin):**
```
Visits Payload Admin → Sees:
- All tenants: Bob's, Sarah's, Alex's stores
- All products from all stores (50+ products)
- All orders across the platform
- Platform revenue and analytics
```

## How Data Flows in Your Multi-Tenant System

### 1. User Signs Up
```typescript
// User creates account
User {
  email: "bob@example.com",
  roles: ["user"]  // Regular user, not super-admin
}
```

### 2. User Creates a Tenant (Store)
```typescript
// Bob creates his storefront
Tenant {
  name: "Bob's Digital Art",
  slug: "bob",  // Becomes bob.dabro.com
  stripeAccountId: "acct_123...",
  stripeDetailsSubmitted: true
}
```

This is defined in `src/collections/Tenants.ts`.

### 3. User Creates Products
```typescript
// Bob creates a product
Product {
  name: "Sunset Painting",
  price: 29.99,
  tenant: "bob",  // 👈 Automatically linked by multi-tenant plugin
}
```

**The Magic:** The plugin automatically adds the `tenant` relationship behind the scenes!

### 4. Data Queries Are Automatically Scoped

When Bob fetches products via tRPC:

```typescript
// In your tRPC procedure
const products = await ctx.payload.find({
  collection: "products",
  // Plugin automatically adds: where: { tenant: { equals: bob's-tenant-id } }
});
// Bob only sees his products! ✅
```

When you (super-admin) fetch products:

```typescript
// Same code, but you see ALL products from all tenants! ✅
const products = await ctx.payload.find({
  collection: "products",
  // No tenant filter applied for super-admins
});
```

## Practical Benefits

### For Store Owners (Tenants)
- Can't accidentally delete other people's products
- Can't see competitor pricing
- Their dashboard is clean and focused
- Privacy and data security

### For You (Platform Owner)
- Manage the entire marketplace from one admin panel
- Handle support issues across all stores
- Monitor platform health and revenue
- Enforce platform policies

### For Development
- Don't write manual filtering code for every query
- Automatic security - can't accidentally expose data
- Centralized tenant logic in one place
- Easy to add more multi-tenant collections

## Adding More Multi-Tenant Collections

Currently only `products` are scoped to tenants. You might want to add:

```typescript
multiTenantPlugin({
  collections: {
    products: {},
    orders: {},      // Each tenant sees only their orders
    customers: {},   // Each tenant has their own customer list
    analytics: {},   // Each tenant sees their own stats
  },
  userHasAccessToAllTenants: (user) =>
    Boolean(user.roles?.includes("super-admin")),
})
```

## Complete User Journey Example

Let's walk through a real scenario:

### Step 1: Bob Registers on Your Platform

```typescript
POST /api/users/register
{
  email: "bob@artist.com",
  password: "secure123",
  name: "Bob Smith"
}

// Created in database:
User {
  id: "user_bob_123",
  email: "bob@artist.com",
  roles: ["user"]  // Not a super-admin
}
```

### Step 2: Bob Creates His Store

```typescript
POST /api/tenants/create
{
  name: "Bob's Digital Art Gallery",
  slug: "bobsart"  // Will be accessible at bobsart.dabro.com
}

// After Stripe verification:
Tenant {
  id: "tenant_bob_456",
  name: "Bob's Digital Art Gallery",
  slug: "bobsart",
  stripeAccountId: "acct_stripe_789",
  stripeDetailsSubmitted: true,
  owner: "user_bob_123"  // Linked to Bob's user account
}
```

### Step 3: Bob Adds Products

```typescript
POST /api/products/create
{
  name: "Mountain Sunset Digital Print",
  price: 29.99,
  description: "Beautiful landscape art"
}

// Multi-tenant plugin automatically adds tenant:
Product {
  id: "prod_001",
  name: "Mountain Sunset Digital Print",
  price: 29.99,
  tenant: "tenant_bob_456"  // 👈 Added automatically!
}
```

### Step 4: Sarah Also Creates a Store (Separately)

```typescript
// Sarah's tenant
Tenant {
  id: "tenant_sarah_789",
  name: "Sarah's Music Downloads",
  slug: "sarahmusic"
}

// Sarah's product
Product {
  id: "prod_002",
  name: "Piano Album Vol 1",
  price: 15.99,
  tenant: "tenant_sarah_789"  // Sarah's tenant
}
```

### Step 5: What Each User Sees

**When Bob visits the Payload Admin:**
```typescript
// Bob queries products
const bobProducts = await payload.find({
  collection: "products"
});

// Returns:
[
  {
    id: "prod_001",
    name: "Mountain Sunset Digital Print",
    tenant: "tenant_bob_456"
  }
  // Sarah's product is NOT visible to Bob! ✅
]
```

**When you (super-admin) visit the Payload Admin:**
```typescript
// Same query, different results
const allProducts = await payload.find({
  collection: "products"
});

// Returns:
[
  {
    id: "prod_001",
    name: "Mountain Sunset Digital Print",
    tenant: "tenant_bob_456"
  },
  {
    id: "prod_002",
    name: "Piano Album Vol 1",
    tenant: "tenant_sarah_789"
  }
  // You see everything! ✅
]
```

## Security in Action

### Scenario: Bob Tries to Access Sarah's Product

```typescript
// Bob attempts to update Sarah's product
const result = await payload.update({
  collection: "products",
  id: "prod_002",  // Sarah's product
  data: {
    price: 0.99  // Trying to change Sarah's price!
  }
});

// Result: Error! Product not found
// The multi-tenant plugin blocks access ✅
```

### Scenario: You (Super-Admin) Handle a Support Request

```typescript
// Customer reports issue with Sarah's product
// You can access it because you're super-admin
const product = await payload.findByID({
  collection: "products",
  id: "prod_002"  // Sarah's product
});

// Success! You can help resolve the issue ✅
```

## Summary

- **Tenant** = Individual storefront within your platform (like individual shops in a mall)
- **Multi-Tenant Plugin** = Automatic data isolation between stores (each shop only sees their inventory)
- **Super-Admin** = Platform owner who manages everything (mall manager who oversees all shops)
- **Regular Users** = Store owners who only see their own data (individual shop owners)

Your platform is like **Shopify** or **Gumroad** - multiple independent sellers under one roof, each with their own branded storefront and complete data privacy! 🏪

## Next Steps

1. Create a user account with `super-admin` role to test platform-wide access
2. Create multiple test tenants to see data isolation in action
3. Consider adding more collections to the multi-tenant configuration (orders, customers, etc.)
4. Implement subdomain routing to serve tenant-specific storefronts
