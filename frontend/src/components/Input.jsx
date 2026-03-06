import React from 'react';
import { motion } from 'framer-motion';

const Input = ({ label, error, className = '', icon: Icon, ...props }) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`
            w-full py-3.5 rounded-2xl border-2 outline-none transition-all font-medium text-sm
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${error 
              ? 'border-red-100 bg-red-50 focus:border-red-500 focus:bg-white text-red-900' 
              : 'border-slate-50 bg-slate-50 focus:border-indigo-600 focus:bg-white text-slate-900'}
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1"
        >
          <div className="w-1 h-1 rounded-full bg-red-500" />
          {error}
        </motion.span>
      )}
    </div>
  );
};

export default Input;
