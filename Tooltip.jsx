import React from 'react';



const Tooltip.FC = ({ content, children, className }) => {
  return (
    <div className={`relative group flex items-center ${className}`}>
      {children}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-900 dark-black text-white text-xs rounded-md shadow-lg opacity-0 group-hover-100 transition-opacity duration-300 pointer-events-none z-50">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;