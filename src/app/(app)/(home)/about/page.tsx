import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Dabro</h1>

      <div className="prose prose-gray max-w-none">
        <section className="mb-12">
          <p className="text-lg text-gray-600 mb-6">
            Dabro is the modern platform where creators build storefronts, sell
            digital products, and grow their business. We empower independent
            creators to monetize their skills and reach customers worldwide.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 mb-4">
            We believe every creator deserves the tools to succeed. Our mission
            is to democratize e-commerce by providing a powerful, easy-to-use
            platform that handles the technical complexity so you can focus on
            what you do best: creating amazing digital products.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Multi-Tenant Storefronts
              </h3>
              <p className="text-gray-600 text-sm">
                Each creator gets their own customizable storefront with a
                unique subdomain, complete brand control, and professional
                product displays.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600 text-sm">
                Powered by Stripe Connect, receive payments directly to your
                account with industry-leading security and fraud protection.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Digital Product Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Automatic delivery of digital products including courses,
                templates, graphics, audio, and more with secure access
                controls.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Built for Scale
              </h3>
              <p className="text-gray-600 text-sm">
                Whether you&apos;re just starting out or have thousands of
                customers, Dabro grows with you without compromising
                performance.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Values
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="font-semibold text-gray-900 mr-2">
                Creator First:
              </span>
              <span className="text-gray-600">
                Every decision we make is focused on helping creators succeed
                and grow their businesses.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-gray-900 mr-2">
                Transparency:
              </span>
              <span className="text-gray-600">
                Clear pricing, honest communication, and no hidden fees. What
                you see is what you get.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-gray-900 mr-2">
                Simplicity:
              </span>
              <span className="text-gray-600">
                Powerful features wrapped in an intuitive interface. Complexity
                is our problem, not yours.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-gray-900 mr-2">
                Reliability:
              </span>
              <span className="text-gray-600">
                Your store is your business. We ensure 99.9% uptime so you
                never miss a sale.
              </span>
            </li>
          </ul>
        </section>

        <section className="bg-gray-900 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-gray-300 mb-6">
            Join thousands of creators who trust Dabro to power their digital
            product business.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Create Your Store
          </Link>
        </section>
      </div>
    </div>
  );
}
