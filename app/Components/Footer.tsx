'use client';

import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-pink-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-bold text-pink-600">
                            Apni Dukan
                        </Link>
                        <p className="mt-4 text-sm text-gray-600 max-w-md">
                        Stay Connected with Apni Dukan! <br />
Follow us on social media for the latest updates, special offers, and new arrivals. Have any questions? Reach out to our support team for quick assistance. Thank you for shopping with us!


                        </p>
                        <div className="mt-6 flex space-x-6">
                            {/* Social Media Links */}
                            {['facebook', 'twitter', 'instagram'].map((social) => (
                                <a
                                    key={social}
                                    href={`https://${social}.com`}
                                    className="text-gray-400 hover:text-pink-500"
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="h-6 w-6 bg-current rounded-full" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">
                            Quick Links
                        </h3>
                        <ul className="mt-4 space-y-4">
                            {[
                                { name: 'About Us', href: '/about' },
                                { name: 'Products', href: '/products' },
                                { name: 'Contact', href: '/contact' },
                                { name: 'FAQ', href: '/faq' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-base text-gray-600 hover:text-pink-600"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">
                            Contact Us
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <li className="text-base text-gray-600">
                                <p>Saddar Town, Karachi</p>
                                <p>Pakistan</p>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/923232714932"
                                    target='main'
                                    className="text-base text-gray-600 hover:text-pink-600"
                                >
                                    +92 (323) 2714932
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:info@apnidukan.com"
                                    className="text-base text-gray-600 hover:text-pink-600"
                                >
                                    info@apnidukan.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-base text-gray-500 text-center">
                        © {currentYear} Apni Dukan. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
