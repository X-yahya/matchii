import React, { useState, useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
import avatar from "../../assets/images/avatar.png"; // Default avatar image
import newRequest from "../../utils/newRequest"; // Adjust the import path as necessary
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown menu
  const navigator = useNavigate() ;
  const currentUser = JSON.parse( localStorage.getItem("currentUser" ) ) ;

  const handleLogout = async()=>
  {
    try {
      await newRequest.post("/auth/logout") ;
      localStorage.setItem("currentUser",null) ;
      navigator("/login")
    }catch(err)
    {
      console.log(err)
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}>
      <div className="bg-white font-sf">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 animate-fadeInDown">
            <div className="flex-shrink-0">
              <a
                href="/"
                className="text-2xl font-bold text-gray-900 hover:scale-105 transition-transform duration-300"
              >
                Freelance
              </a>
            </div>



            <div className="hidden md:flex space-x-4 items-center">
              <a href="/co-koffee" className="text-gray-800 hover:text-gray-600 transition hover:scale-105 duration-300">
                collaboration
              </a>
              { !currentUser?.isSeller &&
              <a href="/login" className="text-gray-800 hover:text-gray-600 transition hover:scale-105 duration-300">
                Sign In
              </a>}

              {!currentUser?.isSeller && (
                <>
                  <a
                    href="/login"
                    className="text-gray-800 hover:text-gray-600 transition hover:scale-105 duration-300"
                  >
                    Become a Seller
                  </a>
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition hover:scale-105 duration-300"
                    onClick={() => navigator("/register")}
                  >
                    Join
                  </button>
                </>
              )}

              {currentUser && (
                <div className="relative flex items-center space-x-3" ref={dropdownRef}>
                  <img
                    src={currentUser.img || avatar}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-gray-300 shadow-sm cursor-pointer"
                    onClick={() => setOpen(!open)}
                  />
                  <span className="text-gray-800 cursor-pointer" onClick={() => setOpen(!open)}>
                    {currentUser.username}
                  </span>

                  {open && (
                    <div className="absolute right-0 top-12 flex flex-col bg-white shadow-md rounded-lg py-2 px-4 space-y-2 w-48">
                      {currentUser?.isSeller && (
                        <>
                          <a href="/mygigs" className="hover:text-blue-500 transition">
                            Gigs
                          </a>
                          <a href="/add" className="hover:text-blue-500 transition">
                            Add New Gig
                          </a>
                        </>
                      )}
                      <a href="/orders" className="hover:text-blue-500 transition">
                        Orders
                      </a>
                      <a href="/messages" className="hover:text-blue-500 transition">
                        Messages
                      </a>
                      <button className="text-left hover:text-red-500 transition" onClick={handleLogout}>
                      Logout</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition hover:rotate-90 duration-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="block md:hidden mt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for services"
                className="w-full bg-gray-100 rounded-full pl-4 pr-10 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-300 transform"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-200 transform"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
        >
          <div className="md:hidden bg-white px-4 pt-4 pb-2 space-y-2">
            <a
              href="/become-seller"
              className="block text-gray-800 hover:text-gray-600 transition hover:scale-105 duration-300"
            >
              Become a Seller
            </a>
            <a
              href="/login"
              className="block text-gray-800 hover:text-gray-600 transition hover:scale-105 duration-300"
            >
              Sign In
            </a>
            <button
              type="button"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition hover:scale-105 duration-300"
            >
              Join
            </button>
          </div>
        </Transition>
      </div>

      {/* Custom Animation */}
      <style jsx="true">{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.5s ease-out both;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
