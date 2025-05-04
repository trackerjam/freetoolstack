import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. What Are Cookies</h2>
            <p className="text-gray-600">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide useful information to website owners.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <strong>Essential Cookies:</strong> Required for basic website functionality
              </li>
              <li>
                <strong>Performance Cookies:</strong> Help us understand how visitors interact with our website
              </li>
              <li>
                <strong>Functionality Cookies:</strong> Remember your preferences and settings
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Cookie Types We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Essential Cookies</h3>
                <p className="text-gray-600">
                  These cookies are necessary for the website to function properly. They cannot be disabled.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Analytics Cookies</h3>
                <p className="text-gray-600">
                  We use anonymous analytics cookies to understand how visitors interact with our website.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Managing Cookies</h2>
            <p className="text-gray-600 mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>View cookies stored on your computer</li>
              <li>Delete individual cookies</li>
              <li>Block cookies from particular sites</li>
              <li>Block all cookies from being set</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about our use of cookies, please contact us at{' '}
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