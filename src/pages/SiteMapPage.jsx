import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG, navLists, footerLinks } from '../constants';

const SiteMapPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const siteMapSections = [
    {
      title: 'Main Pages',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ]
    },
    {
      title: 'Shopping',
      links: [
        { name: 'Cart', path: '/cart' },
        { name: 'Checkout', path: '/checkout' },
        { name: 'Orders', path: '/orders' },
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'Sign In', path: '/signin' },
        { name: 'Sign Up', path: '/signup' },
      ]
    },
    {
      title: 'Legal & Policies',
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms of Use', path: '/terms-of-use' },
        { name: 'Sales Policy', path: '/sales-policy' },
        { name: 'Site Map', path: '/sitemap' },
      ]
    },
    {
      title: 'Customer Support',
      links: [
        { name: 'Contact Us', path: '/contact' },
        { name: 'About Us', path: '/about' },
      ]
    }
  ];

  return (
    <section className="w-screen min-h-screen bg-black text-white overflow-hidden relative">
      <div className="screen-max-width common-padding">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-semibold mb-8">Site Map</h1>
          <p className="text-gray-200 mb-12">
            Navigate through all pages and sections of our website
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteMapSections.map((section, index) => (
              <div key={index} className="bg-zinc-900 rounded-2xl p-6 hover:bg-zinc-800 transition-colors">
                <h2 className="text-2xl font-semibold text-white mb-4 border-b border-zinc-700 pb-3">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.path.startsWith('/#') ? (
                        <a
                          href={link.path}
                          className="text-gray-100 hover:text-blue-400 transition-colors flex items-center group"
                        >
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3 group-hover:bg-blue-400 transition-colors"></span>
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="text-gray-100 hover:text-blue-400 transition-colors flex items-center group"
                        >
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3 group-hover:bg-blue-400 transition-colors"></span>
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-6">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/" 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-6 text-center transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-6 text-center transition-colors font-medium"
              >
                About
              </Link>
              <Link 
                to="/cart" 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-6 text-center transition-colors font-medium"
              >
                View Cart
              </Link>
              <Link 
                to="/contact" 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-6 text-center transition-colors font-medium"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800">
            <div className="bg-zinc-900 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Need Help?</h2>
              <p className="text-gray-100 mb-6 leading-relaxed">
                Can't find what you're looking for? Our customer support team is here to help.
              </p>
              <div className="space-y-3 text-gray-100">
                <p>
                  <strong className="text-white">Email:</strong>{' '}
                  <a href={`mailto:support@${SITE_CONFIG.brandName.toLowerCase()}.com`} className="text-blue-400 hover:underline">
                    akashcodesharma@gmail.com
                  </a>
                </p>
                <p>
                  <strong className="text-white">Phone:</strong>{' '}
                  <a href="tel:00000-040-1966" className="text-blue-400 hover:underline">
                    00000-040-1966
                  </a>
                </p>
                <p>
                  <strong className="text-white">Hours:</strong> Monday-Friday, 8:00 AM - 8:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>© {SITE_CONFIG.copyrightYear} {SITE_CONFIG.brandName} Inc. All rights reserved.</p>
            <p className="mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteMapPage;
