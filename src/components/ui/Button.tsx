import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          // Variants
          'bg-[#0B8A5F] text-white hover:bg-[#0A7A55] shadow-lg shadow-[#0B8A5F]/25 focus:ring-[#0B8A5F]': variant === 'primary',
          'bg-[#F48C42] text-white hover:bg-[#E67E3C] shadow-lg shadow-[#F48C42]/25 focus:ring-[#F48C42]': variant === 'secondary',
          'border-2 border-[#0B8A5F] text-[#0B8A5F] hover:bg-[#0B8A5F] hover:text-white focus:ring-[#0B8A5F]': variant === 'outline',
          'text-[#0B8A5F] hover:bg-[#0B8A5F]/10 focus:ring-[#0B8A5F]': variant === 'ghost',
          'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500': variant === 'destructive',
          
          // Sizes
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}