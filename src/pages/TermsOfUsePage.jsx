import React, { useEffect } from 'react';
import { SITE_CONFIG } from '../constants';

const TermsOfUsePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className="w-screen min-h-screen bg-black text-white overflow-hidden relative">
      <div className="screen-max-width common-padding">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-semibold mb-8">Terms of Use</h1>
          <p className="text-gray-200 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-gray-100">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Agreement to Terms</h2>
              <p className="leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provisions 
                of this agreement. If you do not agree to these terms, please do not use this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Use License</h2>
              <p className="leading-relaxed mb-4">
                Permission is granted to temporarily access the materials on {SITE_CONFIG.brandName}'s website for 
                personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
              <p className="leading-relaxed mb-4">Under this license, you may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or public display</li>
                <li>Attempt to decompile or reverse engineer any software on the website</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Product Information</h2>
              <p className="leading-relaxed">
                We strive to provide accurate product descriptions and pricing. However, we do not warrant that 
                product descriptions, pricing, or other content on this site is accurate, complete, reliable, 
                current, or error-free. We reserve the right to correct any errors, inaccuracies or omissions 
                and to change or update information at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Pricing and Payment</h2>
              <p className="leading-relaxed mb-4">
                All prices are subject to change without notice. We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Refuse any order placed through this website</li>
                <li>Limit quantities purchased per person, household, or order</li>
                <li>Discontinue any product at any time</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Payment must be received in full before your order will be processed. We accept major credit cards, 
                debit cards, and other payment methods as displayed at checkout.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Account Registration</h2>
              <p className="leading-relaxed">
                When you create an account with us, you must provide accurate, complete, and current information. 
                You are responsible for maintaining the confidentiality of your account credentials and for all 
                activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
              <p className="leading-relaxed">
                All content on this website, including but not limited to text, graphics, logos, images, videos, 
                and software, is the property of {SITE_CONFIG.brandName} or its content suppliers and is protected 
                by international copyright laws. Unauthorized use of any materials may violate copyright, trademark, 
                and other laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">User Conduct</h2>
              <p className="leading-relaxed mb-4">
                You agree not to use the website to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful or malicious code</li>
                <li>Collect or store personal data about other users</li>
                <li>Interfere with or disrupt the website or servers</li>
                <li>Engage in any fraudulent activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <p className="leading-relaxed">
                In no event shall {SITE_CONFIG.brandName} be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or 
                inability to use the materials on this website, even if {SITE_CONFIG.brandName} has been notified 
                of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer</h2>
              <p className="leading-relaxed">
                The materials on this website are provided on an 'as is' basis. {SITE_CONFIG.brandName} makes no 
                warranties, expressed or implied, and hereby disclaims and negates all other warranties including, 
                without limitation, implied warranties or conditions of merchantability, fitness for a particular 
                purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Links to Third-Party Websites</h2>
              <p className="leading-relaxed">
                This website may contain links to third-party websites that are not owned or controlled by 
                {SITE_CONFIG.brandName}. We have no control over, and assume no responsibility for, the content, 
                privacy policies, or practices of any third-party websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
              <p className="leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of the 
                jurisdiction in which {SITE_CONFIG.brandName} operates, and you irrevocably submit to the 
                exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Modifications to Terms</h2>
              <p className="leading-relaxed">
                {SITE_CONFIG.brandName} may revise these terms of use at any time without notice. By using this 
                website, you are agreeing to be bound by the current version of these terms of use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Use, please contact us at:
              </p>
              <p className="mt-4 leading-relaxed">
                {SITE_CONFIG.brandName}<br />
                Email: akashcodesharma@gmail.com<br />
                Phone: 00000-040-1966
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsOfUsePage;
