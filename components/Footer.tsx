import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 dark:bg-black mt-8">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-white mb-4">ABOUT</h3>
                        <ul>
                            <li className="mb-2"><a href="#" className="hover:text-white">Contact Us</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-white">About Us</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-white">Careers</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-white">Our Story</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">HELP</h3>
                        <ul>
                            <li className="mb-2"><a href="#" className="hover:text-white">Payments</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-white">Shipping</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-white">Cancellation & Returns</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-white">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">POLICY</h3>
                        <ul>
                            <li className="mb-2"><a href="#" className="hover:text-white">Return Policy</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-white">Terms Of Use</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-white">Security</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-white">Privacy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">SOCIAL</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-white"><Facebook size={24} /></a>
                            <a href="#" className="hover:text-white"><Twitter size={24} /></a>
                            <a href="#" className="hover:text-white"><Instagram size={24} /></a>
                            <a href="#" className="hover:text-white"><Linkedin size={24} /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>&copy; {new Date().getFullYear()} ShopLux. All Rights Reserved.</p>
                    <p className="mt-4 md:mt-0">Made with ❤️ for demonstration purposes.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;