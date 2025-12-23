export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">
        Privacy Policy – Munjiz
      </h1>

      <p className="text-sm text-gray-500 mb-8">
        Last updated: 22 December 2025
      </p>

      <section className="space-y-6 leading-relaxed">
        <p>
          Munjiz respects your privacy and is committed to protecting your
          personal data. This Privacy Policy explains how information is
          collected, used, and protected when using the application.
        </p>

        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <ul className="list-disc pl-6">
          <li>Customer name</li>
          <li>Phone number</li>
          <li>Delivery address</li>
          <li>Order notes (if provided)</li>
          <li>Products, quantities, prices, and order status</li>
        </ul>

        <h2 className="text-xl font-semibold">2. How We Use Information</h2>
        <ul className="list-disc pl-6">
          <li>Organizing and managing orders</li>
          <li>Submitting orders through the admin application</li>
          <li>Displaying orders in the admin dashboard</li>
          <li>Contacting customers regarding their orders</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Data Sharing</h2>
        <p>
          Munjiz does not sell, rent, or share user data with third parties.
          Data may only be disclosed if required by law.
        </p>

        <h2 className="text-xl font-semibold">4. Data Security</h2>
        <p>
          Appropriate technical and organizational measures are applied to
          protect personal data.
        </p>

        <h2 className="text-xl font-semibold">5. User Rights</h2>
        <ul className="list-disc pl-6">
          <li>Request access to personal data</li>
          <li>Request correction or deletion of data</li>
          <li>Stop using the application at any time</li>
        </ul>

        <h2 className="text-xl font-semibold">6. Children’s Privacy</h2>
        <p>
          Munjiz is not intended for children under the age of 13.
        </p>

        <h2 className="text-xl font-semibold">7. Changes to This Policy</h2>
        <p>
          This policy may be updated periodically.
        </p>

        <h2 className="text-xl font-semibold">8. Contact Us</h2>
        <p>
          Email:{" "}
          <a
            href="mailto:hamza.lutfi68@gmail.com"
            className="text-blue-600 underline"
          >
            hamza.lutfi68@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
