import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md';
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
  outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
};

const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm' };

export const Button = ({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) => (
  <button
    className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
    {children}
  </button>
);
