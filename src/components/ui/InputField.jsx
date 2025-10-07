// src/components/ui/InputField.jsx
import React from 'react';

const InputField = React.forwardRef(({ icon, label, isTextArea = false, className, ...props }, ref) => (
  <div>
    {label && (
      <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-secondary">
        {icon}{label}
      </label>
    )}
    {isTextArea ? (
      <textarea 
        ref={ref}
        {...props} 
        rows="3" 
        className={`w-full bg-secondary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all text-text-secondary ${className}`} // <--- ADICIONADO AQUI
      />
    ) : (
      <input 
        ref={ref}
        {...props} 
        className={`w-full bg-secondary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all text-text-secondary ${className}`} // <--- E AQUI
      />
    )}
  </div>
));

export default InputField;
