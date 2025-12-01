import React, { createContext, useState, ReactNode, useCallback } from 'react';

export 

export 

export const DeviceModeContext = createContext<DeviceModeContextType | undefined>(undefined);

export const DeviceModeProvider.FC<{ children }> = ({ children }) => {
  const [deviceMode, setDeviceModeState] = useState<DeviceMode | null>(() => {
    try {
      const savedMode = localStorage.getItem('deviceMode');
      return savedMode ? (savedMode as DeviceMode) ;
    } catch (error) {
      console.error("Could not access localStorage:", error);
      return null;
    }
  });

  const setDeviceMode = useCallback((mode) => {
    try {
      localStorage.setItem('deviceMode', mode);
    } catch (error) {
      console.error("Could not write to localStorage:", error);
    }
    setDeviceModeState(mode);
  }, []);

  const clearDeviceMode = useCallback(() => {
    try {
      localStorage.removeItem('deviceMode');
    } catch (error) {
      console.error("Could not remove from localStorage:", error);
    }
    setDeviceModeState(null);
  }, []);

  const value = {
    deviceMode,
    setDeviceMode,
    clearDeviceMode,
  };

  return <DeviceModeContext.Provider value={value}>{children}</DeviceModeContext.Provider>;
};