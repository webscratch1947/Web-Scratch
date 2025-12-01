import React, { forwardRef } from 'react';



const Checkbox = forwardRef(({ label, id, className, ...props }, ref) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        ref={ref}
        type="checkbox"
        className={`h-4 w-4 rounded border-white/[.08] bg-white/5 text-primary focus-secondary focus-2 ${className}`}
        {...props}
      />
      <label htmlFor={id} className="ml-2 block text-sm text-text-secondary">
        {label}
      </label>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;