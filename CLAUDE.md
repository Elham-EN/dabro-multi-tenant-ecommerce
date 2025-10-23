# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dabro** is a multi-tenant e-commerce platform where creators can build their own storefronts, sell digital products, and get paid through Stripe Connect. The platform uses Payload CMS for content management with MongoDB, Next.js 15 App Router for the frontend, and tRPC for type-safe API communication.

## Development Commands

### Running the Application
```bash
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
```

### Testing
```bash
npm test                 # Run all tests
npm run test:client      # Run client component tests (jsdom environment)
npm run test:server      # Run server component tests (node environment)
npm run test:all         # Run both client and server tests sequentially
npm run test:watch       # Run tests in watch mode
```

### Database & Type Generation
```bash
npm run db:fresh                # Reset database with fresh Payload migrations
npm run generate:types          # Generate TypeScript types from Payload collections
```

The `generate:types` command creates `src/payload-types.ts` which provides type definitions for all Payload collections.

## Architecture Overview

### Multi-Tenant Architecture

The application uses Payload CMS's multi-tenant plugin to isolate data between different storefronts:

- **Tenants Collection**: Represents individual storefronts, each with a unique subdomain slug and Stripe account
- **Multi-Tenant Plugin**: Configured in `src/payload.config.ts` to automatically scope products to tenants
- **Super Admin Access**: Users with `super-admin` role can access all tenants

### tRPC API Architecture

The API uses tRPC for end-to-end type safety between client and server:

**Core Files:**
- `src/lib/trpc/init.ts`: tRPC initialization with context and base procedures
- `src/lib/trpc/routers/_app.ts`: Main router that combines all feature routers
- `src/lib/trpc/client.tsx`: Client-side setup with React Query integration
- `src/lib/trpc/server.tsx`: Server-side setup for React Server Components

**Context & Middleware:**
- Every tRPC procedure automatically receives a `ctx.payload` instance via middleware in `init.ts`
- The base procedure (`baseProcedure`) connects to Payload CMS for all API calls

**Adding New Procedures:**
1. Create procedures in `src/modules/[feature]/server/procedures.tsx`
2. Export a router using `createTRPCRouter()`
3. Import and add to `appRouter` in `src/lib/trpc/routers/_app.ts`
4. Use in components: `const trpc = useTRPC(); useQuery(trpc.feature.getData.queryOptions())`

### Module Structure

Features are organized in `src/modules/` by domain:

```
src/modules/
├── auth/
│   ├── schema.ts              # Zod validation schemas
│   └── server/
│       └── procedures.tsx     # Auth tRPC procedures
├── categories/
│   └── server/
│       └── procedures.tsx     # Category tRPC procedures
├── products/
│   └── server/
│       └── procedures.tsx     # Product tRPC procedures
└── tags/
    ├── schema.ts              # Zod validation schemas
    └── server/
        └── procedures.tsx     # Tag tRPC procedures
```

Each module exports a router that gets combined in the main `appRouter`.

### Payload CMS Collections

Collections are defined in `src/collections/`:

- **Users.ts**: User authentication and roles (integrated with Next.js auth)
- **Tenants.ts**: Storefronts with subdomain slugs and Stripe account info
- **Products.ts**: Digital products scoped to tenants via multi-tenant plugin
- **Categories.ts**: Hierarchical category system (parent-child relationships)
- **Tags.ts**: Product tags for filtering and organization
- **Media.ts**: File uploads and media management

**Key Configuration:**
- Payload config: `src/payload.config.ts`
- Generated types: `src/payload-types.ts` (generated via `npm run generate:types`)
- MongoDB connection via `@payloadcms/db-mongodb` adapter

### Next.js App Structure

The app uses Next.js 15 App Router with route groups:

```
src/app/
├── (app)/                     # Main application route group
│   ├── (home)/               # Public-facing pages with navbar
│   │   ├── _components/      # Shared components (Navbar, Footer, Categories)
│   │   ├── _hooks/           # Custom React hooks
│   │   ├── [category]/       # Dynamic category pages
│   │   └── layout.tsx        # Layout with navbar and footer
│   ├── (auth)/               # Authentication pages
│   │   ├── sign-in/         # Login page
│   │   └── sign-up/         # Registration page
│   └── layout.tsx            # Root app layout with TRPCReactProvider
├── (payload)/                # Payload CMS admin route group
│   └── admin/               # CMS admin interface
└── api/
    └── trpc/                # tRPC API endpoint
        └── [trpc]/
            └── route.ts     # tRPC HTTP handler
```

**Route Group Purposes:**
- `(app)`: Wraps main application routes
- `(home)`: Adds navbar/footer layout to public pages
- `(auth)`: Authentication pages without navbar
- `(payload)`: Isolated Payload CMS admin interface

### Testing Strategy

The project has separate Jest configurations for different environments:

- **`jest.config.ts`**: Client component tests using jsdom (for React components with browser APIs)
- **`jest.server.config.ts`**: Server component tests using node environment (for async server components)

Both configs use `@testing-library/react` for component testing and are integrated with Next.js via `next/jest`.

## Environment Variables

Required in `.env`:

```env
DATABASE_URI=mongodb://localhost:27017/dabro-ecommerce
PAYLOAD_SECRET=your-super-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000  # For tRPC server-side calls
```

## Key Design Patterns

### Server vs Client Components

- **Server Components**: Default in Next.js App Router, used for data fetching with `trpc` from `@/lib/trpc/server`
- **Client Components**: Marked with `"use client"`, use `useTRPC()` hook for tRPC calls
- **Package Enforcement**: `server-only` and `client-only` packages prevent incorrect imports

### Type Safety

- **tRPC**: Full end-to-end type safety from API to frontend via `AppRouter` type export
- **Zod Schemas**: Input validation in `schema.ts` files, shared between tRPC and React Hook Form
- **Payload Types**: Auto-generated from collections via `generate:types` command
- **Path Aliases**: `@/*` maps to `src/*`, `@payload-config` maps to `src/payload.config.ts`

### Data Fetching Patterns

**Server Components:**
```typescript
import { trpc } from "@/lib/trpc/server";
const data = await trpc.categories.getMany();
```

**Client Components:**
```typescript
const trpc = useTRPC();
const { data } = useQuery(trpc.categories.getMany.queryOptions());
```

### Authentication Flow

- Payload CMS handles authentication with session management
- HTTP-only cookies for secure session storage
- User roles defined in Users collection for authorization
- Protected routes check user session server-side

## Important Notes

- **Type Generation**: After modifying Payload collections, always run `npm run generate:types`
- **Testing Environments**: Use `test:client` for components with DOM APIs, `test:server` for async server logic
- **Multi-Tenancy**: Products are automatically scoped to tenants when the multi-tenant plugin is active
- **Subdomain Support**: Next.js config includes `allowedDevOrigins` for local subdomain testing with `.local-origin.dev`
- **tRPC Context**: Every procedure has access to `ctx.payload` - the Payload CMS instance for database operations
- **Strict TypeScript**: The project uses strict mode - ensure all types are properly defined
