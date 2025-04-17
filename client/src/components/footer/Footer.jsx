import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-8 pb-4 mt-8 animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-4">
        {/* Upper Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo/Brand */}
          <div className="mb-4 md:mb-0">
            <a
              href="/"
              className="text-2xl font-bold text-gray-900 hover:scale-105 transition-transform duration-300"
            >
              Freelance
            </a>
          </div>
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <a
              href="/about"
              className="text-gray-700 hover:text-blue-500 transition transform hover:scale-105 duration-300"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-700 hover:text-blue-500 transition transform hover:scale-105 duration-300"
            >
              Contact
            </a>
            <a
              href="/privacy"
              className="text-gray-700 hover:text-blue-500 transition transform hover:scale-105 duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-gray-700 hover:text-blue-500 transition transform hover:scale-105 duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
        {/* Lower Section */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Freelance. All rights reserved.
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx="true">{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out both;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
