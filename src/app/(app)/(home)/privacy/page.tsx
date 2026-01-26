export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Privacy Policy
      </h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-600 mb-4">
            At Dabro, we are committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Information We Collect
          </h2>
          <p className="text-gray-600 mb-4">
            We collect information you provide directly to us:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              Account information (name, email, password, username)
            </li>
            <li>
              Payment information (processed securely through Stripe)
            </li>
            <li>Store and product information</li>
            <li>Communications with us or other users</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-600 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>
              Send promotional communications (with your consent)
            </li>
            <li>Respond to your comments and questions</li>
            <li>
              Detect, investigate, and prevent fraudulent transactions
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Information Sharing
          </h2>
          <p className="text-gray-600 mb-4">
            We do not sell your personal information. We may share your
            information in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>With service providers who assist our operations</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With your consent or at your direction</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Payment Processing
          </h2>
          <p className="text-gray-600 mb-4">
            All payment processing is handled by Stripe. We do not store
            your complete credit card information on our servers.
            Please review Stripe&apos;s privacy policy for more
            information about how they handle your payment data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Data Security
          </h2>
          <p className="text-gray-600 mb-4">
            We implement appropriate technical and organizational
            measures to protect your personal information. However, no
            method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Cookies and Tracking
          </h2>
          <p className="text-gray-600 mb-4">
            We use cookies and similar tracking technologies to track
            activity on our platform and hold certain information. You
            can instruct your browser to refuse all cookies or indicate
            when a cookie is being sent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Your Rights
          </h2>
          <p className="text-gray-600 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Access and receive a copy of your personal data</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Children&apos;s Privacy
          </h2>
          <p className="text-gray-600 mb-4">
            Our service is not intended for children under 13 years of
            age. We do not knowingly collect personal information from
            children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            10. Changes to This Policy
          </h2>
          <p className="text-gray-600 mb-4">
            We may update this Privacy Policy from time to time. We will
            notify you of any changes by posting the new policy on this
            page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            11. Contact Us
          </h2>
          <p className="text-gray-600 mb-4">
            If you have questions about this Privacy Policy, please
            contact us at privacy@dabro.com.
          </p>
        </section>
      </div>
    </div>
  );
}
