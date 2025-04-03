import React, { useState } from 'react';
import { FileText, Download, Table as Tabs, RefreshCw } from 'lucide-react';

interface PrivacyFormData {
  companyName: string;
  website: string;
  email: string;
  collectsPersonalData: boolean;
  usesAnalytics: boolean;
  usesCookies: boolean;
}

interface TOSFormData {
  companyName: string;
  website: string;
  email: string;
  allowsUserContent: boolean;
  hasSubscriptions: boolean;
  hasRefundPolicy: boolean;
  jurisdiction: string;
}

export default function PolicyGenerator() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'tos'>('privacy');
  const [privacyData, setPrivacyData] = useState<PrivacyFormData>({
    companyName: '',
    website: '',
    email: '',
    collectsPersonalData: false,
    usesAnalytics: false,
    usesCookies: false
  });

  const [tosData, setTosData] = useState<TOSFormData>({
    companyName: '',
    website: '',
    email: '',
    allowsUserContent: false,
    hasSubscriptions: false,
    hasRefundPolicy: false,
    jurisdiction: 'United States'
  });

  const [generatedPrivacyPolicy, setGeneratedPrivacyPolicy] = useState<string>('');
  const [generatedTOS, setGeneratedTOS] = useState<string>('');

  const handlePrivacyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPrivacyData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTOSInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setTosData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generatePrivacyPolicy = () => {
    const policy = `
Privacy Policy for ${privacyData.companyName}

Last updated: ${new Date().toLocaleDateString()}

1. Introduction

Welcome to ${privacyData.website}. This Privacy Policy explains how we collect, use, and protect your information when you use our website.

2. Information We Collect

${privacyData.collectsPersonalData ? `We collect personal information that you voluntarily provide to us, including:
- Name
- Email address
- Contact information` : 'We do not collect personal information directly from users.'}

${privacyData.usesAnalytics ? `3. Analytics

We use analytics tools to understand how visitors use our website. This may include:
- Pages visited
- Time spent on site
- Browser type
- Geographic location` : ''}

${privacyData.usesCookies ? `4. Cookies

We use cookies to enhance your browsing experience. You can control cookie settings through your browser preferences.` : ''}

5. Contact Us

If you have any questions about this Privacy Policy, please contact us at:
${privacyData.email}

DISCLAIMER: This is a generated template and should be reviewed by a legal professional before use.
    `;

    setGeneratedPrivacyPolicy(policy);
  };

  const generateTOS = () => {
    const tos = `
Terms of Service for ${tosData.companyName}

Last updated: ${new Date().toLocaleDateString()}

1. Agreement to Terms

By accessing and using ${tosData.website}, you agree to be bound by these Terms of Service and all applicable laws and regulations.

2. Use License

Permission is granted to temporarily access and use our services for personal, non-commercial use, subject to these Terms.

${tosData.allowsUserContent ? `3. User Content

When you submit, upload, or share content through our services:
- You retain ownership of your content
- You grant us a license to use, display, and distribute your content
- You are responsible for the content you submit` : ''}

${tosData.hasSubscriptions ? `4. Subscriptions and Payments

- Subscription fees are billed in advance
- Cancellations take effect at the end of the current billing period
- We reserve the right to change subscription fees with notice` : ''}

${tosData.hasRefundPolicy ? `5. Refund Policy

- Refund requests must be submitted within 30 days of purchase
- Refunds are processed within 5-10 business days
- Some services may be non-refundable` : ''}

6. Limitation of Liability

To the fullest extent permitted by law, ${tosData.companyName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages.

7. Governing Law

These Terms shall be governed by and construed in accordance with the laws of ${tosData.jurisdiction}.

8. Contact Information

For any questions regarding these Terms, please contact us at:
${tosData.email}

DISCLAIMER: This is a generated template and should be reviewed by a legal professional before use.
    `;

    setGeneratedTOS(tos);
  };

  const downloadPolicy = (type: 'privacy' | 'tos') => {
    const element = document.createElement('a');
    const content = type === 'privacy' ? generatedPrivacyPolicy : generatedTOS;
    const filename = type === 'privacy' ? 'privacy-policy.txt' : 'terms-of-service.txt';
    
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = (type: 'privacy' | 'tos') => {
    const content = type === 'privacy' ? generatedPrivacyPolicy : generatedTOS;
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Policy Generator</h1>
        
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'privacy'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'tos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tos')}
          >
            Terms of Service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeTab === 'privacy' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={privacyData.companyName}
                  onChange={handlePrivacyInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="text"
                  name="website"
                  value={privacyData.website}
                  onChange={handlePrivacyInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={privacyData.email}
                  onChange={handlePrivacyInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="collectsPersonalData"
                    checked={privacyData.collectsPersonalData}
                    onChange={handlePrivacyInputChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Collects Personal Data
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="usesAnalytics"
                    checked={privacyData.usesAnalytics}
                    onChange={handlePrivacyInputChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Uses Analytics
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="usesCookies"
                    checked={privacyData.usesCookies}
                    onChange={handlePrivacyInputChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Uses Cookies
                  </label>
                </div>
              </div>

              <button
                onClick={generatePrivacyPolicy}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Generate Privacy Policy
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={tosData.companyName}
                  onChange={handleTOSInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="text"
                  name="website"
                  value={tosData.website}
                  onChange={handleTOSInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={tosData.email}
                  onChange={handleTOSInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurisdiction
                </label>
                <select
                  name="jurisdiction"
                  value={tosData.jurisdiction}
                  onChange={handleTOSInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="United States">United States</option>
                  <option value="European Union">European Union</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowsUserContent"
                    checked={tosData.allowsUserContent}
                    onChange={handleTOSInputChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Allows User Content
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasSubscriptions"
                    checked={tosData.hasSubscriptions}
                    onChange={handleTOSInputChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Has Subscription Services
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasRefundPolicy"
                    checked={tosData.hasRefundPolicy}
                    onChange={handleTOSInputChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Include Refund Policy
                  </label>
                </div>
              </div>

              <button
                onClick={generateTOS}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Generate Terms of Service
              </button>
            </div>
          )}

          <div className="relative">
            {((activeTab === 'privacy' && generatedPrivacyPolicy) || 
              (activeTab === 'tos' && generatedTOS)) ? (
              <>
                <div className="absolute top-0 right-0 flex gap-2">
                  <button
                    onClick={() => copyToClipboard(activeTab)}
                    className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={() => downloadPolicy(activeTab)}
                    className="flex items-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-10 whitespace-pre-wrap font-mono text-sm">
                  {activeTab === 'privacy' ? generatedPrivacyPolicy : generatedTOS}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FileText className="w-16 h-16 mb-4" />
                <p>Generated policy will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}