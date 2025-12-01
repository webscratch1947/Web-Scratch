import React, { forwardRef } from 'react';
import Spinner from './Spinner';






const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg focus-none focus-2 focus-offset-2 dark-offset-dark-bg transition-all duration-200 disabled-50 disabled-not-allowed';

const variantClasses = {
  primary: 'text-white bg-gradient-to-r from-primary to-secondary hover-glow-cyan-md focus-secondary disabled-none disabled-muted',
  secondary: 'bg-transparent text-text-main border border-primary/50 hover-primary/10 hover-primary hover-glow-violet-md focus-primary',
  ghost: 'text-text-secondary hover-text-main hover-white/5 focus-secondary',
  subtle: 'bg-black/20 text-white/80 hover-black/40 hover-white backdrop-blur-sm',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const iconOnlyClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

const Button = forwardRef(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    iconOnly = false,
    className = '',
    children,
    ...props
  }, ref) => {
    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      iconOnly ? iconOnlyClasses[size] ,
      className
    ].join(' ');

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Spinner className="mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;