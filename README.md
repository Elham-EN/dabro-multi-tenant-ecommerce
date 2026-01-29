# Dabro

A multi-tenant e-commerce platform where creators can build storefronts, sell digital products, and get paid through Stripe Connect.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **CMS:** Payload CMS 3
- **Database:** MongoDB
- **API:** tRPC
- **Styling:** Tailwind CSS
- **Payments:** Stripe Connect
- **Storage:** Vercel Blob
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Stripe account

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/dabro.git
cd dabro
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Required variables:
```env
DATABASE_URI=mongodb://localhost:27017/dabro
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=your-stripe-secret
```

4. Run database migrations
```bash
npm run db:fresh
```

5. Seed the database (optional)
```bash
npx tsx src/seed.ts
```

6. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run generate:types` | Generate Payload types |

## License

MIT
