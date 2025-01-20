'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { items } = useCart();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-pink-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand Name */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-pink-600">
                            Apni Dukan
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link 
                                href="/" 
                                className="text-pink-700 hover:bg-pink-100 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Home
                            </Link>
                            <Link 
                                href="/products" 
                                className="text-pink-600 hover:bg-pink-100 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Products
                            </Link>
                            <Link 
                                href="/about" 
                                className="text-pink-600 hover:bg-pink-100 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                About Us
                            </Link>
                            <Link 
                                href="/contact" 
                                className="text-pink-600 hover:bg-pink-100 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Contact
                            </Link>
                            <Link 
                                href="/cart" 
                                className="text-pink-600 hover:bg-pink-100 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                            >
                                Cart
                                {items.length > 0 && (
                                    <span className="ml-2 bg-pink-600 text-white px-2 py-1 rounded-full text-xs">
                                        {items.length}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-pink-600 hover:text-pink-700 hover:bg-pink-100 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="text-pink-600 hover:bg-pink-100 block px-3 py-2 rounded-md text-base font-medium">
                            Home
                        </Link>
                        <Link href="/products" className="text-pink-600 hover:bg-pink-100 block px-3 py-2 rounded-md text-base font-medium">
                            Products
                        </Link>
                        <Link href="/about" className="text-pink-600 hover:bg-pink-100 block px-3 py-2 rounded-md text-base font-medium">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-pink-600 hover:bg-pink-100 block px-3 py-2 rounded-md text-base font-medium">
                            Contact
                        </Link>
                        <Link href="/cart" className="text-pink-600 hover:bg-pink-100 block px-3 py-2 rounded-md text-base font-medium  items-center">
                            Cart
                            {items.length > 0 && (
                                <span className="ml-2 bg-pink-600 text-white px-2 py-1 rounded-full text-xs">
                                    {items.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
