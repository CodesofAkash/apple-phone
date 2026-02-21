import React, { useEffect } from 'react';
import { SITE_CONFIG } from '../constants';

const SalesPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className="w-screen min-h-screen bg-black text-white overflow-hidden relative">
      <div className="screen-max-width common-padding">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-semibold mb-8">Sales Policy</h1>
          <p className="text-gray-200 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-gray-100">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
              <p className="leading-relaxed">
                This Sales Policy outlines the terms and conditions governing the sale of {SITE_CONFIG.productName + " "} 
                and related products through our website. Please read this policy carefully before making a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Product Availability</h2>
              <p className="leading-relaxed mb-4">
                All products are subject to availability. We make every effort to ensure that product information 
                and stock levels are accurate. However:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We do not guarantee that products will be in stock at all times</li>
                <li>We reserve the right to limit quantities available for purchase</li>
                <li>Product availability may vary by region</li>
                <li>Pre-order items may have different availability timelines</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Pricing</h2>
              <p className="leading-relaxed mb-4">
                All prices displayed on our website are in the local currency and include applicable taxes unless 
                otherwise stated. Please note:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Prices are subject to change without prior notice</li>
                <li>We reserve the right to correct pricing errors</li>
                <li>Promotional prices are valid for the specified period only</li>
                <li>Monthly payment options are subject to credit approval</li>
                <li>Trade-in values are estimates and may vary based on device condition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Order Process</h2>
              <p className="leading-relaxed mb-4">
                When you place an order:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>You will receive an order confirmation email</li>
                <li>Your payment will be processed and authorized</li>
                <li>We will verify product availability</li>
                <li>You will receive a shipping confirmation when your order is dispatched</li>
                <li>Orders are typically processed within 1-2 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Payment Methods</h2>
              <p className="leading-relaxed mb-4">
                We accept the following payment methods:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Credit cards (Visa, MasterCard, American Express)</li>
                <li>Debit cards</li>
                <li>Digital wallets (Apple Pay, Google Pay)</li>
                <li>Bank transfers (for certain regions)</li>
                <li>Financing options (subject to approval)</li>
              </ul>
              <p className="leading-relaxed mt-4">
                All payments are processed securely through encrypted payment gateways. We do not store your 
                complete payment card information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Shipping and Delivery</h2>
              <p className="leading-relaxed mb-4">
                Shipping information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Standard shipping: 5-7 business days</li>
                <li>Expedited shipping: 2-3 business days</li>
                <li>Express shipping: 1-2 business days</li>
                <li>Free shipping on orders over a certain amount (varies by region)</li>
                <li>Delivery times may vary during peak seasons or promotional periods</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Shipping charges are calculated at checkout based on your location and selected shipping method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Returns and Exchanges</h2>
              <p className="leading-relaxed mb-4">
                We offer a 14-day return policy from the date of delivery:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Products must be in original packaging</li>
                <li>All accessories and documentation must be included</li>
                <li>Products must be in unused, like-new condition</li>
                <li>Return shipping costs may apply</li>
                <li>Refunds will be processed to the original payment method within 7-10 business days</li>
              </ul>
              <p className="leading-relaxed mt-4">
                To initiate a return, please contact our customer service team or use your online account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Warranty</h2>
              <p className="leading-relaxed mb-4">
                All {SITE_CONFIG.productName} devices come with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>One-year limited hardware warranty</li>
                <li>90 days of complimentary technical support</li>
                <li>Option to purchase extended warranty coverage</li>
              </ul>
              <p className="leading-relaxed mt-4">
                The warranty covers manufacturing defects but does not cover accidental damage, normal wear and 
                tear, or damage caused by misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Order Cancellation</h2>
              <p className="leading-relaxed">
                You may cancel your order before it has shipped at no charge. Once an order has been shipped, 
                our return policy applies. To cancel an order, please contact customer service immediately or 
                use your online account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">International Sales</h2>
              <p className="leading-relaxed mb-4">
                For international orders:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Additional customs duties and taxes may apply</li>
                <li>Delivery times may be longer than domestic orders</li>
                <li>Product availability may vary by country</li>
                <li>Warranty coverage may differ based on location</li>
                <li>You are responsible for ensuring compliance with local import regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Product Customization</h2>
              <p className="leading-relaxed">
                Customized or engraved products cannot be returned unless there is a manufacturing defect or 
                error in the customization. Please carefully review your customization before completing your order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Gift Cards and Promotional Credits</h2>
              <p className="leading-relaxed mb-4">
                When using gift cards or promotional credits:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Gift cards have no expiration date</li>
                <li>Promotional credits may expire after a specified period</li>
                <li>Multiple payment methods can be combined</li>
                <li>Gift cards are non-refundable and cannot be exchanged for cash</li>
                <li>Lost or stolen gift cards cannot be replaced</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Trade-In Program</h2>
              <p className="leading-relaxed">
                Our trade-in program allows you to exchange your eligible device for credit toward a new purchase. 
                Final trade-in value is determined upon inspection of your device and is based on its condition, 
                model, and market value.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Customer Service</h2>
              <p className="leading-relaxed">
                For questions about our sales policy, orders, or products, please contact us:
              </p>
              <p className="mt-4 leading-relaxed">
                {SITE_CONFIG.brandName}<br />
                Email: akashcodesharma@gmail.com<br />
                Phone: 00000-040-1966<br />
                Hours: Monday-Friday, 8:00 AM - 8:00 PM
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Policy Updates</h2>
              <p className="leading-relaxed">
                We reserve the right to update or modify this Sales Policy at any time. Changes will be posted 
                on this page with an updated revision date. Continued use of our website after changes constitutes 
                acceptance of the updated policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesPolicyPage;
