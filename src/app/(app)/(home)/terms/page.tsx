export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Terms of Service
      </h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 mb-4">
            By accessing and using Dabro, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please
            do not use our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Description of Service
          </h2>
          <p className="text-gray-600 mb-4">
            Dabro is a multi-tenant e-commerce platform that allows
            creators to build storefronts, sell digital products, and
            receive payments through Stripe Connect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. User Accounts
          </h2>
          <p className="text-gray-600 mb-4">
            You are responsible for maintaining the confidentiality of
            your account credentials and for all activities that occur
            under your account. You must provide accurate and complete
            information when creating an account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Seller Responsibilities
          </h2>
          <p className="text-gray-600 mb-4">
            As a seller on Dabro, you agree to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              Provide accurate descriptions of your digital products
            </li>
            <li>Deliver products as described to customers</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Handle customer inquiries and disputes professionally</li>
            <li>Not sell prohibited or illegal content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Payments and Fees
          </h2>
          <p className="text-gray-600 mb-4">
            Payments are processed through Stripe Connect. Sellers are
            responsible for any applicable fees, taxes, and charges
            associated with their transactions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Intellectual Property
          </h2>
          <p className="text-gray-600 mb-4">
            You retain ownership of your digital products. By using
            Dabro, you grant us a limited license to display and
            distribute your products through our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Prohibited Content
          </h2>
          <p className="text-gray-600 mb-4">
            You may not sell content that is illegal, infringes on
            intellectual property rights, contains malware, or violates
            the rights of others.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Limitation of Liability
          </h2>
          <p className="text-gray-600 mb-4">
            Dabro is provided &quot;as is&quot; without warranties of any
            kind. We are not liable for any indirect, incidental, or
            consequential damages arising from your use of the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Changes to Terms
          </h2>
          <p className="text-gray-600 mb-4">
            We reserve the right to modify these terms at any time.
            Continued use of the platform after changes constitutes
            acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            10. Contact
          </h2>
          <p className="text-gray-600 mb-4">
            If you have questions about these Terms of Service, please
            contact us at support@dabro.com.
          </p>
        </section>
      </div>
    </div>
  );
}
