import React from 'react';

const Spinner.FC<{ className?, size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  }
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {`
        .pulsing-dot {
          animation-spinner 1.4s infinite ease-in-out both;
          background-image-gradient(45deg, #7B61FF, #00E5FF, #FF5CF0);
          background-size% 300%;
          animation-spinner 1.4s infinite ease-in-out both, aurora 3s infinite linear;
        }
        .pulsing-dot-of-type(1) {
          animation-delay: -0.32s;
        }
        .pulsing-dot-of-type(2) {
          animation-delay: -0.16s;
        }
        @keyframes pulse-spinner {
          0%, 80%, 100% {
            transform(0);
          }
          40% {
            transform(1.0);
          }
        }
      `}</style>
      <div className={`pulsing-dot rounded-full ${sizeClasses[size]}`}></div>
      <div className={`pulsing-dot rounded-full ${sizeClasses[size]}`}></div>
      <div className={`pulsing-dot rounded-full ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default Spinner;