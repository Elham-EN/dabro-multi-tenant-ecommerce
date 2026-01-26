import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      title: "Multi-Tenant Storefronts",
      description:
        "Get your own customizable storefront with a unique subdomain. Full control over branding, layout, and product presentation.",
      highlights: [
        "Custom subdomain (yourstore.dabro.com)",
        "Brand customization",
        "Professional product pages",
        "Mobile-responsive design",
      ],
    },
    {
      title: "Stripe Connect Payments",
      description:
        "Receive payments directly to your Stripe account with industry-leading security. No middleman holding your money.",
      highlights: [
        "Direct payouts to your account",
        "Support for 135+ currencies",
        "Fraud protection included",
        "Instant payment notifications",
      ],
    },
    {
      title: "Digital Product Delivery",
      description:
        "Sell any type of digital product with automatic, secure delivery to your customers immediately after purchase.",
      highlights: [
        "Instant download access",
        "Secure file hosting",
        "Protected content for buyers only",
        "Support for all file types",
      ],
    },
    {
      title: "Product Management",
      description:
        "Easily manage your entire product catalog with our intuitive admin dashboard powered by Payload CMS.",
      highlights: [
        "Rich text descriptions",
        "Category organization",
        "Tag-based filtering",
        "Flexible refund policies",
      ],
    },
    {
      title: "Customer Reviews",
      description:
        "Build trust with authentic customer reviews and ratings displayed on your product pages.",
      highlights: [
        "Star ratings system",
        "Written reviews",
        "Verified purchase badges",
        "Review moderation tools",
      ],
    },
    {
      title: "Analytics Dashboard",
      description:
        "Track your sales, understand your customers, and grow your business with detailed analytics.",
      highlights: [
        "Sales tracking",
        "Customer insights",
        "Product performance",
        "Revenue reports",
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Everything You Need to Sell Digital Products
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Dabro provides all the tools you need to launch, manage, and grow
          your digital product business.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <ul className="space-y-2">
              {feature.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Built for Creators
            </h2>
            <p className="text-gray-600 mb-6">
              Whether you&apos;re selling courses, templates, graphics, music,
              ebooks, or any other digital product, Dabro has the tools you
              need to succeed.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
                No technical knowledge required
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
                Set up your store in minutes
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
                Start selling immediately
              </li>
            </ul>
          </div>
          <div className="text-center">
            <Link
              href="/sign-up"
              className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Start Selling Today
            </Link>
            <p className="text-sm text-gray-500 mt-3">
              No credit card required to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
