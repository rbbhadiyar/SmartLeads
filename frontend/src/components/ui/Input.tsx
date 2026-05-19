import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <input
      ref={ref}
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors
        border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
        disabled:bg-gray-50 dark:disabled:bg-gray-700 ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Input.displayName = 'Input';
