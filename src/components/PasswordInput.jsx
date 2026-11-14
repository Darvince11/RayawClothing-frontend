import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

// Password field with a show/hide toggle (eye icon)
export default function PasswordInput({ value, onChange, placeholder = 'Password', ...rest }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative group">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
      <input
        {...rest}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        className="w-full bg-[#2C2C2C] text-white pl-12 pr-12 py-4 rounded-xl border border-transparent focus:border-primary/50 focus:bg-[#333] outline-none transition-all placeholder:text-gray-500"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
