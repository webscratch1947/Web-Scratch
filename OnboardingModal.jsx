import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import * as Icons from './Icons';



const OnboardingModal.FC = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity }}
      animate={{ opacity }}
      exit={{ opacity }}
      transition={{ duration.5 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ y, opacity, scale.9 }}
        animate={{ y, opacity, scale }}
        exit={{ y, opacity, scale.9 }}
        transition={{ duration.5, type: 'spring', damping, stiffness }}
        className="w-full max-w-lg rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glow-cyan-lg p-8 text-center"
      >
        <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-primary rounded-full opacity-30 blur-2xl animate-pulse"></div>
            <Icons.SparklesIcon className="w-24 h-24 text-secondary animate-shimmer"/>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
            Welcome to Web Scratch!
        </h1>
        <p className="text-text-secondary mb-8">
            You're all set. Explore the dashboard to generate images, create videos, and bring your ideas to life with AI.
        </p>
        <Button 
            className="w-full sm-auto text-lg px-8 py-3 animate-pulse-subtle"
            onClick={onClose}
        >
            Let's Get Started
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingModal;
