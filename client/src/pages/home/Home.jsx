import React from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiGrid,
  FiMessageCircle,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiShield,
  FiActivity,
  FiTool,
  FiArrowRight,
  FiBriefcase,
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiBriefcase as FiBriefcaseIcon,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      id: 1,
      icon: <FiTool className="w-6 h-6" />,
      title: "AI Service Optimizer",
      desc: "Améliorez vos descriptions de service avec des suggestions IA",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      id: 2,
      icon: <FiSearch className="w-6 h-6" />,
      title: "Smart Matching",
      desc: "Système intelligent de mise en relation clients/freelances",
      gradient: "from-green-500 to-cyan-500",
    },
    {
      id: 3,
      icon: <FiGrid className="w-6 h-6" />,
      title: "Tous Services",
      desc: "Trouvez ou proposez des services dans toutes les catégories",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      id: 4,
      icon: <FiCalendar className="w-6 h-6" />,
      title: "Projets Long Terme",
      desc: "Espace dédié aux collaborations durables et formation d'équipes",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="bg-white text-gray-900 antialiased">
      
     {/* Hero Section */}{/* Hero Section */}
<section className="pt-40 pb-28 px-6 text-center bg-gradient-to-b from-blue-50/50 to-white">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <h1 className="text-7xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent leading-tight mb-6">
      Tunisian Collaboration Hub
    </h1>
    <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      Plateforme tout-en-un pour services freelance et collaborations stratégiques
    </p>

    <div className="mt-16 flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
      {/* Services Card */}
      <motion.div
        whileHover={{ y: -10 }}
        whileTap={{ scale: 0.98 }}
        className="group relative flex-1 p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 cursor-pointer"
        onClick={() => navigate('/gigs')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
        <div className="relative z-10">
          <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <FiSearch className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Trouver des Services</h3>
          <p className="text-gray-600 mb-6">Explorez notre marché de services professionnels</p>
          <div className="inline-flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
            <span className="font-medium">Parcourir les services</span>
            <FiArrowRight className="ml-2 w-5 h-5" />
          </div>
        </div>
      </motion.div>

      {/* Projects Card */}
      <motion.div
        whileHover={{ y: -10 }}
        whileTap={{ scale: 0.98 }}
        className="group relative flex-1 p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 cursor-pointer"
        onClick={() => navigate('/projects')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
        <div className="relative z-10">
          <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
            <FiBriefcase className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Trouver des Projets</h3>
          <p className="text-gray-600 mb-6">Découvrez des opportunités de collaboration</p>
          <div className="inline-flex items-center text-purple-600 group-hover:text-purple-700 transition-colors">
            <span className="font-medium">Voir les projets</span>
            <FiArrowRight className="ml-2 w-5 h-5" />
          </div>
        </div>
      </motion.div>
    </div>
  </motion.div>
</section>

      {/* Features Grid */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-semibold mb-4">Fonctionnalités Clés</h2>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto">
              Découvrez notre suite d'outils conçue pour transformer votre façon de collaborer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl`} />
                <div className={`mb-6 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}>
                  {React.cloneElement(feature.icon, { className: "w-6 h-6 text-white" })}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}

    </div>
  );
};

export default Home;