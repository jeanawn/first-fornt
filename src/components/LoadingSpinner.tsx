interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'blue' | 'white';
}

export default function LoadingSpinner({ size = 'md', className = '', color = 'blue' }: LoadingSpinnerProps) {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colors = {
    blue: 'text-blue-600',
    white: 'text-white'
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${colors[color]} ${sizes[size]}`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}