import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
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
    // update user on storage change
    const handleStorage = () => {
      const stored = localStorage.getItem("currentUser");
      setCurrentUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", handleStorage);

    // handle scroll shadow
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new Event("storage"));
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 bg-white transition-shadow ${scrolled ? "shadow-md" : ""}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="text-2xl font-bold text-gray-900 hover:scale-105 transition-transform">
              Freelance
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="/projects"
                className="text-gray-800 hover:text-gray-600 transition"
              >
                Collaboration
              </a>

              {!currentUser && (
                <>
                  <a
                    href="/login"
                    className="text-gray-800 hover:text-gray-600 transition"
                  >
                    Become a Seller
                  </a>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                  >
                    Join
                  </button>
                </>
              )}

              {currentUser && !currentUser.isSeller && (
                <a
                  href="/become-seller"
                  className="text-gray-800 hover:text-gray-600 transition"
                >
                  Become a Seller
                </a>
              )}

              {currentUser && (
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setOpen(!open)}
                  >
                    <img
                      src={currentUser.image || avatar}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border"
                    />
                    <span className="ml-2 text-gray-800">
                      {currentUser.username}
                    </span>
                  </div>

                  {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 px-4 space-y-2 z-20">
                      {currentUser.isSeller ? (
                        <>
                          <a
                            href="/mygigs"
                            className="block hover:text-blue-500 transition"
                          >
                            My Gigs
                          </a>
                          <a
                            href="/add"
                            className="block hover:text-blue-500 transition"
                          >
                            Add New Gig
                          </a>
                        </>
                      ) : (
                        <a
                          href="/projects/myprojects"
                          className="block hover:text-blue-500 transition"
                        >
                          My Projects
                        </a>
                      )}

                      <a
                        href="/orders"
                        className="block hover:text-blue-500 transition"
                      >
                        Orders
                      </a>
                      <a
                        href="/messages"
                        className="block hover:text-blue-500 transition"
                      >
                        Messages
                      </a>
                      <a
                        href="/profile"
                        className="block hover:text-gray-600 transition"
                      >
                        Profile
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left hover:text-red-500 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <svg
                  className="h-6 w-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <Transition
            show={mobileMenuOpen}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="md:hidden bg-white px-4 pt-4 pb-2 space-y-2">
              <a
                href="/projects"
                className="block text-gray-800 hover:text-gray-600 transition"
              >
                Collaboration
              </a>
              {currentUser && currentUser.isSeller && (
                <a
                  href="/mygigs"
                  className="block text-gray-800 hover:text-gray-600 transition"
                >
                  My Gigs
                </a>
              )}
              {currentUser && !currentUser.isSeller && (
                <a
                  href="/projects/myprojects"
                  className="block text-gray-800 hover:text-gray-600 transition"
                >
                  My Projects
                </a>
              )}
            </div>
          </Transition>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
