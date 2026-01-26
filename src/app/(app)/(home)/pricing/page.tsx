import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for creators just getting started",
      features: [
        "Up to 5 products",
        "Basic storefront",
        "Stripe Connect payments",
        "Email support",
        "5% transaction fee",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Creator",
      price: "$19",
      period: "/month",
      description: "For growing creators ready to scale",
      features: [
        "Unlimited products",
        "Custom subdomain",
        "Advanced analytics",
        "Priority support",
        "3% transaction fee",
        "Custom refund policies",
        "Review management",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Pro",
      price: "$49",
      period: "/month",
      description: "For established creators and teams",
      features: [
        "Everything in Creator",
        "Custom domain support",
        "API access",
        "Dedicated support",
        "1% transaction fee",
        "Team collaboration",
        "Advanced integrations",
        "White-label options",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: "How do payments work?",
      answer:
        "Payments are processed through Stripe Connect. You connect your Stripe account, and funds go directly to you. We never hold your money.",
    },
    {
      question: "What are transaction fees?",
      answer:
        "Transaction fees are a percentage of each sale that covers payment processing and platform costs. The fee depends on your plan level.",
    },
    {
      question: "Can I change plans later?",
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "The Starter plan is free forever. For Creator and Pro plans, we offer a 14-day free trial so you can test all features.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, and in some regions, local payment methods through Stripe.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee on all paid plans if you&apos;re not satisfied.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your needs. Start free and upgrade as you
          grow.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-xl p-8 ${
              plan.highlighted
                ? "bg-gray-900 text-white ring-2 ring-gray-900 scale-105"
                : "bg-white border border-gray-200"
            }`}
          >
            {plan.highlighted && (
              <span className="inline-block bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Most Popular
              </span>
            )}
            <h3
              className={`text-xl font-semibold mb-2 ${
                plan.highlighted ? "text-white" : "text-gray-900"
              }`}
            >
              {plan.name}
            </h3>
            <div className="mb-4">
              <span
                className={`text-4xl font-bold ${
                  plan.highlighted ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.price}
              </span>
              {plan.period && (
                <span
                  className={plan.highlighted ? "text-gray-300" : "text-gray-500"}
                >
                  {plan.period}
                </span>
              )}
            </div>
            <p
              className={`mb-6 ${
                plan.highlighted ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {plan.description}
            </p>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm">
                  <svg
                    className={`w-4 h-4 mr-2 flex-shrink-0 ${
                      plan.highlighted ? "text-green-400" : "text-green-500"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span
                    className={plan.highlighted ? "text-gray-200" : "text-gray-600"}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className={`block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                plan.highlighted
                  ? "bg-white text-gray-900 hover:bg-gray-100"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center bg-gray-50 rounded-xl p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Start Selling?
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Join thousands of creators who use Dabro to sell their digital
          products. Start free today.
        </p>
        <Link
          href="/sign-up"
          className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Create Your Free Store
        </Link>
      </div>
    </div>
  );
}
