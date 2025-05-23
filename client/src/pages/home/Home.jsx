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
} from "react-icons/fi";

const Home = () => {
  const features = [
    {
      id: 1,
      icon: <FiTool className="w-10 h-10" />,
      title: "AI Service Optimizer",
      desc: "Améliorez vos descriptions de service avec des suggestions IA",
    },
    {
      id: 2,
      icon: <FiSearch className="w-10 h-10" />,
      title: "Smart Matching",
      desc: "Système intelligent de mise en relation clients/freelances",
    },
    {
      id: 3,
      icon: <FiGrid className="w-10 h-10" />,
      title: "Tous Services",
      desc: "Trouvez ou proposez des services dans toutes les catégories",
    },
    {
      id: 4,
      icon: <FiCalendar className="w-10 h-10" />,
      title: "Projets Long Terme",
      desc: "Espace dédié aux collaborations durables et formation d'équipes",
    },
    {
      id: 5,
      icon: <FiMessageCircle className="w-10 h-10" />,
      title: "Chat Intégré",
      desc: "Messagerie avec partage de fichiers et suivi de projet",
    },
    {
      id: 6,
      icon: <FiUsers className="w-10 h-10" />,
      title: "Gestion d'Équipe",
      desc: "Outils collaboratifs pour les projets complexes",
    },
    {
      id: 7,
      icon: <FiShield className="w-10 h-10" />,
      title: "Paiements Sécurisés",
      desc: "Système d'escrow et protection contre les litiges",
    },
    {
      id: 8,
      icon: <FiActivity className="w-10 h-10" />,
      title: "Analyses Temps Réel",
      desc: "Suivi des performances",
    },
  ];

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-light tracking-tight leading-tight"
        >
          Tunisian Collaboration Hub
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl max-w-2xl mx-auto"
        >
          Plateforme tout-en-un pour services freelance et collaborations stratégiques
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-10 px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-medium"
        >
          Commencer Maintenant
        </motion.button>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-semibold leading-snug">
              Gestion de Projets
            </h2>
            <p className="text-lg text-gray-600">
              Tout pour vos collaborations à long terme :
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <FiUsers className="w-6 h-6 text-blue-600" /> Recrutement d'équipe
              </li>
              <li className="flex items-center gap-3">
                <FiCalendar className="w-6 h-6 text-blue-600" /> Calendrier collaboratif
              </li>
              <li className="flex items-center gap-3">
                <FiFileText className="w-6 h-6 text-blue-600" /> Contrats intelligents
              </li>
              <li className="flex items-center gap-3">
                <FiActivity className="w-6 h-6 text-blue-600" /> Suivi de progression
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://source.unsplash.com/random/800x600?collaboration"
              alt="Gestion de projet"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20" />
          </motion.div>
        </div>
      </section>

      {/* Chat System Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://source.unsplash.com/random/800x600?chat"
              alt="Système de messagerie"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-semibold leading-snug">
              Communication Intégrée
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <FiMessageCircle className="w-6 h-6 text-blue-600" /> Chat en temps réel
              </li>
              <li className="flex items-center gap-3">
                <FiSearch className="w-6 h-6 text-blue-600" /> Historique des conversations
              </li>
              <li className="flex items-center gap-3">
                <FiFileText className="w-6 h-6 text-blue-600" /> Partage de documents
              </li>
              <li className="flex items-center gap-3">
                <FiShield className="w-6 h-6 text-blue-600" /> Chiffrement de bout en bout
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-100 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Tunisian Collaboration Hub</p>
        <p className="mt-2 text-sm">Partenariats: Innovibe & Faculté des Sciences de Monastir</p>
      </footer>
    </div>
  );
};

export default Home;