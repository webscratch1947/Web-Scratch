

import React, { SelectHTMLAttributes } from 'react';



const Select.FC = ({ label, id, className, children, ...props }) => {
  return (
    
      {label && <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
      <select
        id={id}
        className={`w-full pl-3 pr-10 py-2 border border-primary/40 rounded-lg shadow-sm focus-none focus-2 focus-offset-2 focus-offset-dark-bg focus-secondary focus-secondary hover-secondary bg-white/5 text-white transition-all duration-200 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;