import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Users, ChevronRight, Activity, Cpu } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-space-900 overflow-hidden relative selection:bg-gold-500/30 selection:text-gold-200">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-500/[0.04] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/[0.03] rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[1000px] h-[300px] bg-gold-400/[0.02] rounded-[100%] blur-[120px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-[0_0_20px_rgba(212,168,83,0.3)]">
            <span className="text-space-900 font-bold text-xl tracking-tighter">F</span>
          </div>
          <span className="text-xl font-display font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Fleet<span className="text-gold-400">Master</span>
          </span>
        </div>

        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 group">
              Go to Dashboard
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white font-medium text-sm transition-colors px-4">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary px-6 py-2.5 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(212,168,83,0.2)] hover:shadow-[0_0_25px_rgba(212,168,83,0.4)] transition-all">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 md:px-12 pt-20 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-gold-500/30 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
          <span className="text-gold-200 text-xs font-semibold tracking-wider uppercase">v2.0 Now Live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl"
        >
          Enterprise Fleet Management for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-amber-600">Modern Era</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12"
        >
          Streamline your operations with AI-powered document verification, multi-level vendor hierarchies, and automated billing—all beautifully designed.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary px-8 py-4 rounded-full text-base font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,168,83,0.3)] hover:shadow-[0_0_50px_rgba(212,168,83,0.5)] transition-all scale-100 hover:scale-105 active:scale-95 duration-200">
              Access Command Center
              <ChevronRight size={20} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary px-8 py-4 rounded-full text-base font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,168,83,0.3)] hover:shadow-[0_0_50px_rgba(212,168,83,0.5)] transition-all scale-100 hover:scale-105 active:scale-95 duration-200">
                Start Free Trial
                <ChevronRight size={20} />
              </Link>
              <Link to="/login" className="glass-panel px-8 py-4 rounded-full text-base font-semibold text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center">
                Vendor Login
              </Link>
            </>
          )}
        </motion.div>

        {/* Floating Dashboard Preview (Abstract) */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-24 w-full relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent z-10"></div>
          <div className="glass-panel-strong border border-gold-500/20 rounded-t-3xl overflow-hidden p-2 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="bg-space-800 rounded-t-2xl border border-white/5 h-[300px] md:h-[450px] w-full flex items-center justify-center relative overflow-hidden">
               {/* Abstract UI lines indicating a dashboard */}
               <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-40">
                  <div className="h-6 w-32 bg-white/10 rounded-full"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-gold-500/20"></div>
                    <div className="h-8 w-24 rounded-full bg-white/10"></div>
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-6 w-full px-8 opacity-20">
                  <div className="h-32 rounded-xl bg-gradient-to-br from-gold-500/20 to-transparent border border-gold-500/10"></div>
                  <div className="h-32 rounded-xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/10"></div>
                  <div className="h-32 rounded-xl bg-gradient-to-br from-indigo-500/20 to-transparent border border-indigo-500/10"></div>
               </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 bg-space-900 border-t border-white/5 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Unrivaled <span className="text-gold-400">Capabilities</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Built from the ground up to solve the most complex challenges in modern fleet management.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-indigo-500/20">
                <Cpu className="text-indigo-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-wide">AI Document OCR</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Instant extraction and verification of driving licenses using Tesseract.js. Eliminate manual data entry and catch fraudulent documents instantly.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-gold-500/20">
                <ShieldCheck className="text-gold-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Multi-Level Vendor RBAC</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                4-tier architectural hierarchy (Super, Regional, City, Local) with granular, controller-enforced delegation rights for unparalleled security.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-emerald-500/20">
                <Activity className="text-emerald-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Automated Billing</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Frictionless subscription payments processing integrated tightly with Razorpay. Secure server-side signature validation (HMAC-SHA256).
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-500 text-sm bg-space-900/50">
        <p>© {new Date().getFullYear()} FleetMaster Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
