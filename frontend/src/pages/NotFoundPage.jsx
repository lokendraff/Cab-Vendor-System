import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import StarField from '../components/layout/StarField';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4 relative overflow-hidden">
      <StarField />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center"
      >
        {/* Giant 404 */}
        <motion.h1
          className="text-[120px] md:text-[180px] font-display font-black leading-none text-gold-gradient"
          animate={{ textShadow: ['0 0 20px rgba(212,168,83,0.3)', '0 0 40px rgba(212,168,83,0.5)', '0 0 20px rgba(212,168,83,0.3)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          404
        </motion.h1>

        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertTriangle className="text-gold-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-300">
            Lost in Space
          </h2>
        </div>

        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for has drifted into the void. 
          Navigate back to your fleet command center.
        </p>

        <Link to="/dashboard">
          <Button variant="gold">
            <Home size={18} />
            Return to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
