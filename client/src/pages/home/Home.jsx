import React from "react";
import Featured from "../../components/featured/Featured";
import Slide from "../../components/slide/Slide";
import { categories } from "../../data";

const Home = () => {
  const features = [
    {
      id: 1,
      icon: (
        <svg
          className="w-12 h-12 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-1.657 0-3 1.343-3 3v4h6v-4c0-1.657-1.343-3-3-3z"
          />
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 20h14a2 2 0 002-2v-2H3v2a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Verified Experts",
      desc: "Hand‑picked professionals ensure top‑tier results, every time.",
    },
    {
      id: 2,
      icon: (
        <svg
          className="w-12 h-12 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M3 6h18M3 14h18M3 18h18"
          />
        </svg>
      ),
      title: "Flexible Pricing",
      desc: "Transparent rates and custom quotes that fit your budget.",
    },
    {
      id: 3,
      icon: (
        <svg
          className="w-12 h-12 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 11c0-2 2-3 2-3s2 1 2 3-2 5-2 5-2-3-2-5z"
          />
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 7c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5z"
          />
        </svg>
      ),
      title: "24/7 Support",
      desc: "Our team is here around the clock to help you succeed.",
    },
    {
      id: 4,
      icon: (
        <svg
          className="w-12 h-12 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17v-6h6v6m2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Secure Payments",
      desc: "Built‑in escrow and instant payouts keep your funds safe.",
    },
  ];

  return (
    <>
      <Featured />
      <Slide categories={categories} />

      {/* Collaboration Section Inline */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-semibold text-gray-900">Co‑Koffee for Teams</h2>
            <p className="text-gray-600 text-lg max-w-md">
              Empower your organization with seamless collaboration, expert support, and custom workflows—all in one place.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-5 8v-8" />
                </svg>
                <span className="text-gray-800 font-medium">Dedicated Manager</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10h4v11H3zM10 3h4v18h-4zM17 14h4v7h-4z" />
                </svg>
                <span className="text-gray-800 font-medium">Team Dashboards</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-gray-800 font-medium">Custom Workflows</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3m0 0c1.657 0 3-1.343 3-3s-1.343-3-3-3m0 0V4m0 10v4" />
                </svg>
                <span className="text-gray-800 font-medium">Volume Discounts</span>
              </div>
            </div>
            <button className="mt-6 bg-blue-500 text-white px-8 py-3 rounded-full shadow hover:bg-blue-600 transition duration-300">
              Learn More
            </button>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://picsum.photos/500/350"
              alt="Collaboration illustration"
              className="w-full max-w-md rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Why Choose Freelance
          </h2>
          <p className="text-gray-600 mt-2">
            Everything you need to take your project from idea to reality.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.id}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-fadeInUp"
            >
              {f.icon}
              <h3 className="mt-4 text-xl font-medium text-gray-900">{f.title}</h3>
              <p className="mt-2 text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>

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
      </section>
    </>
  );
};

export default Home;
