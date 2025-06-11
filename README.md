# Multi-Tenant E-Commerce Platform

A comprehensive multi-tenant e-commerce platform where creators can build their own storefronts, sell digital products, and get paid through Stripe Connect. This platform handles everything from vendor subdomains to automatic platform fees, making it a complete solution for digital marketplaces.

## 🚀 Project Overview

This is a real-world multi-tenant e-commerce application that enables creators to have their own branded storefronts, sell digital products, and manage their business through dedicated dashboards. The platform automatically handles payments, fees, and content delivery while providing a seamless experience for both vendors and customers.

## ✨ Key Features

### 🏬 **Multi-Tenant Architecture**
- Complete tenant isolation with custom subdomains
- Independent vendor storefronts with custom branding
- Scalable architecture supporting unlimited merchants

### 🌐 **Vendor Management**
- Custom merchant subdomains (e.g., `vendor.platform.com`)
- Personalized storefronts with custom themes
- Merchant dashboard for product and order management

### 💳 **Payment & Financial Features**
- Stripe Connect integration for seamless payments
- Automatic platform fee collection
- Direct payouts to merchant accounts
- Comprehensive transaction tracking

### 📱 **User Experience**
- Product ratings and reviews system
- Personal purchase library for customers
- Advanced search and filtering capabilities
- Image upload and media management

### 🛠️ **Administration & Control**
- Role-based access control (RBAC)
- Comprehensive admin dashboard
- Merchant performance analytics
- Content moderation tools

### 🎨 **Technical Excellence**
- Built with Next.js 15 and App Router
- TailwindCSS V4 for modern styling
- ShadcnUI component library
- TypeScript for type safety
- Payload CMS for content management

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5
- **Styling**: TailwindCSS V4
- **UI Components**: ShadcnUI + Radix UI
- **Icons**: Lucide React
- **CMS**: Payload CMS (to be integrated)
- **Payments**: Stripe Connect (to be integrated)
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + TypeScript

## 📁 Project Structure

```
multi-tenant-ecommerce/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/            # Reusable React components
│   │   └── ui/               # ShadcnUI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── progress.tsx
│   │       └── textarea.tsx
│   └── lib/                  # Utility functions
│       └── utils.ts
├── public/                   # Static assets
├── tests/                    # Test configurations
│   ├── jest.config.ts       # Client component tests
│   └── jest.server.config.ts # Server component tests
└── package.json
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

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

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🧪 Testing

This project includes comprehensive testing setup with Jest and React Testing Library.

### Run Tests

```bash
# Run all tests
npm test

# Run client component tests
npm run test:client

# Run server component tests
npm run test:server

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **Server Component Tests**: Test async server components with Node.js environment
- **Client Component Tests**: Test interactive components with jsdom environment

## 🔧 Development

### Adding New Components

1. Create component in `src/components/`
2. Add corresponding test file with `.test.tsx` extension
3. Export from appropriate index files
4. Update Storybook stories if using Storybook

### Code Quality

The project enforces code quality through:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Jest** for testing
- **Prettier** for code formatting (to be configured)

## 🚀 Planned Features

### Phase 1: Core Infrastructure
- [ ] Payload CMS integration
- [ ] Database setup and models
- [ ] Authentication system
- [ ] Basic multi-tenant routing

### Phase 2: E-Commerce Features
- [ ] Product catalog management
- [ ] Shopping cart functionality
- [ ] Stripe Connect integration
- [ ] Order processing system

### Phase 3: Advanced Features
- [ ] Subdomain routing
- [ ] File delivery system
- [ ] Reviews and ratings
- [ ] Analytics dashboard

### Phase 4: Platform Features
- [ ] Admin dashboard
- [ ] Merchant onboarding
- [ ] Revenue sharing
- [ ] Advanced reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [ShadcnUI](https://ui.shadcn.com/) for beautiful UI components
- [Stripe](https://stripe.com/) for payment processing
- [Payload CMS](https://payloadcms.com/) for content management

---

**Note**: This project is currently in development. Features are being implemented incrementally. Check the project board for current progress and upcoming features.