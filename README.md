# Multi-Tenant E-Commerce Platform - Dabro

A comprehensive multi-tenant e-commerce platform where creators can build their own storefronts, sell digital products, and get paid through Stripe Connect. This platform handles everything from vendor subdomains to automatic platform fees, making it a complete solution for digital marketplaces.

## 🚀 Project Overview

**Dabro** is a real-world multi-tenant e-commerce application that enables creators to have their own branded storefronts, sell digital products, and manage their business through dedicated dashboards. The platform automatically handles payments, fees, and content delivery while providing a seamless experience for both vendors and customers.

## ✨ Current Features (Implemented)

### 🔐 **Authentication System**
- Complete user registration and login flow
- Session management with HTTP-only cookies
- Input validation with Zod schemas
- Role-based access control foundation
- Secure password hashing via Payload CMS

### 🏷️ **Smart Category Management**
- Hierarchical category system (parent-child relationships)
- Responsive category navigation that adapts to screen size
- Auto-hiding categories with "View All" functionality
- Dynamic category dropdowns with smart positioning
- Real-time category filtering and search

### 🎨 **Advanced UI/UX**
- Responsive navbar with mobile-first design
- Smart sidebar navigation for mobile devices
- Dynamic category display based on available screen space
- Modern design with TailwindCSS V4 and ShadcnUI
- Comprehensive form handling with React Hook Form

### 🛠️ **Technical Excellence**
- Full-stack TypeScript with end-to-end type safety
- tRPC for type-safe API calls with automatic validation
- Payload CMS integration for content management
- Comprehensive testing setup (Jest + React Testing Library)
- Server and client component separation

### 📱 **Multi-Tenant Architecture Foundation**
- Route group structure ready for tenant isolation
- Payload CMS collections designed for multi-tenancy
- Scalable architecture supporting unlimited merchants
- Custom subdomain preparation in Next.js config

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5
- **Styling**: TailwindCSS V4
- **UI Components**: ShadcnUI + Radix UI
- **Icons**: Lucide React
- **CMS**: Payload CMS 3.42
- **Database**: MongoDB with Mongoose
- **API**: tRPC + TanStack Query
- **Authentication**: Payload CMS Auth
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + TypeScript

## 📁 Project Structure

```
multi-tenant-ecommerce/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (app)/                    # Main application group
│   │   │   ├── (home)/              # Home pages with navigation
│   │   │   │   ├── _components/     # Home-specific components
│   │   │   │   ├── _hooks/          # Custom hooks
│   │   │   │   ├── _types/          # TypeScript definitions
│   │   │   │   └── layout.tsx       # Home layout with navbar
│   │   │   ├── (auth)/              # Authentication pages
│   │   │   │   ├── sign-in/         # Login page
│   │   │   │   └── sign-up/         # Registration page
│   │   │   └── layout.tsx           # App layout
│   │   ├── (payload)/               # Payload CMS admin
│   │   │   └── admin/               # CMS admin interface
│   │   └── api/                     # API routes
│   │       └── trpc/                # tRPC endpoint
│   ├── collections/                 # Payload CMS collections
│   │   ├── Users.ts                 # User collection
│   │   ├── Categories.ts            # Category collection
│   │   └── Media.ts                 # Media collection
│   ├── modules/                     # Feature modules
│   │   ├── auth/                    # Authentication module
│   │   │   ├── schema.ts            # Zod validation schemas
│   │   │   └── server/              # Server-side procedures
│   │   └── categories/              # Categories module
│   │       └── server/              # Category procedures
│   ├── lib/                         # Utility libraries
│   │   ├── trpc/                    # tRPC configuration
│   │   │   ├── client.tsx           # Client-side setup
│   │   │   ├── server.tsx           # Server-side setup
│   │   │   ├── init.ts              # tRPC initialization
│   │   │   └── routers/             # API routers
│   │   └── utils.ts                 # Utility functions
│   ├── components/                  # Reusable components
│   │   └── ui/                      # ShadcnUI components
│   └── __tests__/                   # Test files
├── public/                          # Static assets
└── package.json                     # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- npm, yarn, pnpm, or bun package manager

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd multi-tenant-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URI=mongodb://localhost:27017/dabro-ecommerce
   PAYLOAD_SECRET=your-super-secret-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Payload CMS Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🧪 Testing

Comprehensive testing setup with separate configurations for client and server components.

### Available Test Commands

```bash
# Run all tests
npm test

# Run client component tests (jsdom environment)
npm run test:client

# Run server component tests (node environment)
npm run test:server

# Run both client and server tests
npm run test:all

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

- **Component Testing**: UI components with user interactions
- **Integration Testing**: Component communication and data flow
- **Server Component Testing**: Async components and server logic
- **API Testing**: tRPC procedures and validation

## 🔧 Development Workflow

### Adding New Features

1. **Create tRPC Procedures**
   ```typescript
   // src/modules/[feature]/server/procedures.ts
   export const featureRouter = createTRPCRouter({
     getData: baseProcedure.query(async ({ ctx }) => {
       return await ctx.payload.find({ collection: "your-collection" });
     }),
   });
   ```

2. **Add to Main Router**
   ```typescript
   // src/lib/trpc/routers/_app.ts
   export const appRouter = createTRPCRouter({
     feature: featureRouter,
   });
   ```

3. **Use in Components**
   ```typescript
   const { data } = useQuery(trpc.feature.getData.queryOptions());
   ```

### Code Quality Standards

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Enforced code style and best practices
- **Testing**: All features must have corresponding tests
- **Documentation**: Code comments for complex logic

## 🚀 Upcoming Features

### Phase 1: Core E-Commerce (In Progress)
- [ ] Product catalog management
- [ ] Shopping cart functionality
- [ ] Inventory management
- [ ] Order processing system

### Phase 2: Payment Integration
- [ ] Stripe Connect integration
- [ ] Multi-vendor payment splitting
- [ ] Platform fee collection
- [ ] Payout management

### Phase 3: Multi-Tenancy
- [ ] Subdomain routing system
- [ ] Tenant-specific branding
- [ ] Custom domain support
- [ ] Tenant isolation

### Phase 4: Advanced Features
- [ ] File delivery system for digital products
- [ ] Review and rating system
- [ ] Advanced analytics dashboard
- [ ] Email notification system

### Phase 5: Platform Management
- [ ] Comprehensive admin dashboard
- [ ] Merchant onboarding flow
- [ ] Revenue sharing configuration
- [ ] Performance monitoring

## 📊 Current Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ✅ Complete | Registration, login, session management |
| Category System | ✅ Complete | Hierarchical with smart UI |
| User Management | ✅ Complete | Payload CMS integration |
| Responsive Design | ✅ Complete | Mobile-first approach |
| tRPC Integration | ✅ Complete | Full type safety |
| Testing Framework | ✅ Complete | Jest + RTL setup |
| Product Management | 🔄 Planned | Next priority |
| Payment Processing | 🔄 Planned | Stripe Connect ready |
| Multi-tenant Routing | 🔄 Planned | Architecture prepared |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation for significant changes
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Payload CMS](https://payloadcms.com/) for the powerful headless CMS
- [tRPC](https://trpc.io/) for end-to-end type safety
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS
- [ShadcnUI](https://ui.shadcn.com/) for beautiful UI components
- [TanStack Query](https://tanstack.com/query) for data fetching

---

**Current Status**: 🏗️ **Active Development** - Core features implemented, moving toward full e-commerce functionality.

**Latest Update**: Authentication system, smart category navigation, and comprehensive testing framework completed.

For questions or support, please open an issue or start a discussion in the repository.
