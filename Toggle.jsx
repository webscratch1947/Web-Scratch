import React from 'react';



const Toggle.FC = ({ label, enabled, onChange, disabled = false }) => {
  return (
    <div className={`flex items-center justify-between ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <button
        type="button"
        onClick={() => !disabled && onChange(!enabled)}
        className={`${
          enabled ? 'bg-primary' : 'bg-white/10'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-none focus-2 focus-secondary focus-offset-2 focus-offset-dark-bg`}
        disabled={disabled}
        aria-checked={enabled}
        role="switch"
      >
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

export default Toggle;