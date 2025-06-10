import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { FiMenu, FiX, FiUser, FiLogOut, FiMessageSquare, FiBriefcase, FiFilePlus, FiShoppingBag, FiUsers } from "react-icons/fi";
import avatar from "../../assets/images/avatar.png";
import newRequest from "../../utils/newRequest";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("currentUser");
      setCurrentUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", handleStorage);

    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);

    // Close dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup
    };
  }, []);

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new Event("storage")); // Trigger storage event to update current user state
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md transition-all ${scrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a 
              href="/" 
              className="text-xl font-semibold text-gray-900 hover:opacity-80 transition-opacity"
            >
              emporia
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {!currentUser ? (
                <div className="flex items-center space-x-4">
                  <a
                    href="/register"
                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
                  >
                    Register
                  </a>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-gradient-to-b from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-full hover:shadow-lg transition-all"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  {/* Conditional Link: Freelancer sees Browse Projects, Client sees Browse Gigs */}
                  {currentUser.isSeller ? ( // If the user is a seller (freelancer)
                    <a
                      href="/projects" // Link to browse projects
                      className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
                    >
                      Browse Projects
                    </a>
                  ) : ( // If the user is not a seller (client)
                    <a
                      href="/gigs" // Link to browse gigs
                      className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
                    >
                      Browse Gigs
                    </a>
                  )}

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center space-x-2 group"
                    >
                      <img
                        src={currentUser.image || avatar}
                        alt="Profile"
                        className="w-9 h-9 rounded-full border-2 border-white hover:border-blue-100 transition-colors"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        {currentUser.username}
                      </span>
                    </button>

                    <Transition
                      show={open}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black/5 py-2.5">
                        {currentUser.isSeller ? (
                          <>
                            <a
                              href="/mygigs"
                              className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                            >
                              <FiBriefcase className="w-5 h-5 mr-3 text-gray-400" />
                              My Gigs
                            </a>
                            <a
                              href="/add"
                              className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                            >
                              <FiFilePlus className="w-5 h-5 mr-3 text-gray-400" />
                              New Gig
                            </a>
                            {/* Assigned Projects (for freelancers) */}
                            <a
                              href="/projects/assigned"
                              className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                            >
                              <FiUsers className="w-5 h-5 mr-3 text-gray-400" />
                              Assigned Projects
                            </a>
                          </>
                        ) : (
                          <a
                            href="/projects/myprojects"
                            className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                          >
                            <FiBriefcase className="w-5 h-5 mr-3 text-gray-400" />
                            My Projects
                          </a>
                        )}

                        <a
                          href="/orders"
                          className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                        >
                          <FiShoppingBag className="w-5 h-5 mr-3 text-gray-400" />
                          Orders
                        </a>
                        <a
                          href="/messages"
                          className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                        >
                          <FiMessageSquare className="w-5 h-5 mr-3 text-gray-400" />
                          Messages
                        </a>
                        <a
                          href="/profile"
                          className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                        >
                          <FiUser className="w-5 h-5 mr-3 text-gray-400" />
                          Profile
                        </a>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                        >
                          <FiLogOut className="w-5 h-5 mr-3 text-gray-400" />
                          Logout
                        </button>
                      </div>
                    </Transition>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
        >
          <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-1">
            {/* Mobile Conditional Link: Freelancer sees Browse Projects, Client sees Browse Gigs */}
            {currentUser?.isSeller ? ( // If the user is a seller (freelancer)
              <a
                href="/projects" // Link to browse projects
                className="block px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Browse Projects
              </a>
            ) : ( // If the user is not a seller (client) or not logged in
              <a
                href="/gigs" // Link to browse gigs
                className="block px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Browse Gigs
              </a>
            )}

            {currentUser?.isSeller && (
              <>
                <a
                  href="/mygigs"
                  className="block px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  My Gigs
                </a>
                {/* Assigned Projects (for freelancers) */}
                <a
                  href="/projects/assigned"
                  className="block px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Assigned Projects
                </a>
              </>
            )}
            {currentUser && !currentUser.isSeller && (
              <a
                href="/projects/myprojects"
                className="block px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                My Projects
              </a>
            )}
            {!currentUser && (
              <>
                <a
                  href="/login"
                  className="block px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Become a Seller
                </a>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full text-left px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Join Now
                </button>
              </>
            )}
          </div>
        </Transition>
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;