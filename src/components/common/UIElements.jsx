import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const base = "font-bold rounded-xl transition-all duration-150 inline-flex items-center justify-center gap-2 tap-target select-none cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:scale-100";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
    ghost: "bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent",
    danger: "bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30",
    success: "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30",
    outline: "bg-transparent border border-blue-500/40 text-blue-400 hover:bg-blue-500/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs min-h-[36px]",
    md: "px-4 py-3 text-sm min-h-[48px]",
    lg: "px-6 py-4 text-base min-h-[56px] font-extrabold uppercase tracking-wide",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 stroke-[2.5]" />}
      {children}
    </button>
  );
}

export function Card({ children, className = '', hover = false, onClick, style = {} }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        hover ? 'hover:border-blue-500/40 hover:-translate-y-0.5 cursor-pointer shadow-md' : ''
      } ${className}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function Chip({ label, active = false, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none border tap-target flex items-center justify-center ${
        active 
          ? 'bg-blue-600 text-white border-blue-500 shadow-sm' 
          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
      } ${className}`}
    >
      {label}
    </button>
  );
}

export function StatTile({ label, value, subtext, icon: Icon, color = 'blue' }) {
  return (
    <div 
      className="p-3.5 rounded-2xl border flex flex-col justify-between"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center justify-between text-slate-400 mb-1">
        <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
        {Icon && <Icon className="w-3.5 h-3.5 text-blue-400" />}
      </div>
      <div className="text-2xl font-black font-mono tabular-nums text-white">
        {value}
      </div>
      {subtext && (
        <span className="text-[10px] text-slate-500 mt-0.5">{subtext}</span>
      )}
    </div>
  );
}
