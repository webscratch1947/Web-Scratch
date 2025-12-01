import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../types';
import * as Icons from './Icons';
import { useDeviceMode } from '../../hooks/useDeviceMode';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';



const ProfileDropdown.FC = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { deviceMode, setDeviceMode } = useDeviceMode();
  const { updateDeviceModePreference } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };
  
  const handleModeSwitch = () => {
    if (!deviceMode) return;
    const newMode = deviceMode === 'pc' ? 'mobile' : 'pc';
    setDeviceMode(newMode);
    updateDeviceModePreference(newMode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary font-bold ring-2 ring-transparent hover-secondary transition-all focus-none focus-secondary overflow-hidden"
      >
        {user?.profilePictureUrl ? (
          <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          getInitials(user?.fullName || 'User')
        )}
      </button>

      
        {isOpen && (
          <motion.div
            initial={{ opacity, y: -10, scale.95 }}
            animate={{ opacity, y, scale }}
            exit={{ opacity, y: -10, scale.95 }}
            transition={{ duration.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-dark-bg/80 backdrop-blur-lg border border-white/10 shadow-glow-violet-lg focus-none z-50"
          >
            <div className="p-2">
              <div className="px-3 py-2 border-b border-white/10">
                <p className="text-sm font-semibold text-text-main truncate">{user?.fullName}</p>
                <p className="text-xs text-text-secondary truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button onClick={() => { navigate('/dashboard/profile'); setIsOpen(false); }} className="w-full text-left block px-3 py-2 text-sm text-text-secondary hover-white/5 hover-text-main rounded-md">Edit Profile</button>
                 {deviceMode && (
                    <button onClick={handleModeSwitch} className="w-full text-left flex items-center px-3 py-2 text-sm text-text-secondary hover-white/5 hover-text-main rounded-md">
                        {deviceMode === 'pc' ? <Icons.MobileIcon className="w-4 h-4 mr-2" /> : <Icons.MonitorIcon className="w-4 h-4 mr-2" />}
                        Switch to {deviceMode === 'pc' ? 'Mobile' : 'PC'} View
                    </button>
                )}
                <a href="#" className="block px-3 py-2 text-sm text-text-secondary hover-white/5 hover-text-main rounded-md">Help Center</a>
              </div>
              <div className="pt-1 border-t border-white/10">
                <button
                  onClick={onLogout}
                  className="w-full text-left block px-3 py-2 text-sm text-error hover-error/10 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
