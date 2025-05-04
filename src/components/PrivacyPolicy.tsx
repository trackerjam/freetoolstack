import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information that you voluntarily provide when using our tools and services.
            </p>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Usage Data</h3>
            <p className="text-gray-600">
              We may collect anonymous usage data to improve our services, including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and features used</li>
              <li>Time and date of your visit</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Provide and maintain our services</li>
              <li>Improve and optimize our tools</li>
              <li>Analyze usage patterns and trends</li>
              <li>Detect and prevent technical issues</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Storage</h2>
            <p className="text-gray-600">
              All tools on FreeToolStack operate client-side, meaning your data is processed in your browser and is not stored on our servers. Any data you enter is temporary and is cleared when you close your browser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Cookies</h2>
            <p className="text-gray-600">
              We use essential cookies to ensure the basic functionality of our website. These cookies do not collect any personal information and are used solely for technical purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hello@freetoolstack.com" className="text-blue-600 hover:text-blue-800">
                hello@freetoolstack.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}