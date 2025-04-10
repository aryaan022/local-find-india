import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-6 w-6 text-india-orange" />
              <span className="text-xl font-bold text-white">LocalFind</span>
              <span className="text-india-orange font-bold">India</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Connecting local businesses with customers across India. Find products and services near you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-india-orange">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-india-orange">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-india-orange">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-india-orange">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-india-orange">Home</Link>
              </li>
              <li>
                <Link to="/businesses" className="text-gray-300 hover:text-india-orange">Businesses</Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-india-orange">Categories</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-india-orange">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-india-orange">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">For Businesses</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/business-register" className="text-gray-300 hover:text-india-orange">Register Business</Link>
              </li>
              <li>
                <Link to="/business-login" className="text-gray-300 hover:text-india-orange">Business Login</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-india-orange">Pricing Plans</Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-gray-300 hover:text-india-orange">Success Stories</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="text-india-orange mt-1 flex-shrink-0" />
                <span className="text-gray-300">Lovely Professional University, Punjab, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} className="text-india-orange flex-shrink-0" />
                <a href="tel:+917037169747" className="text-gray-300 hover:text-india-orange">+91 70371 69747</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="text-india-orange flex-shrink-0" />
                <a href="mailto:aryankhokhar022@gmail.com" className="text-gray-300 hover:text-india-orange">aryankhokhar022@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} LocalFind India. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 text-sm hover:text-india-orange">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 text-sm hover:text-india-orange">Terms of Service</Link>
            <Link to="/faqs" className="text-gray-400 text-sm hover:text-india-orange">FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
