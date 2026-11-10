import { useState, useRef, useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MailCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useShop, PENDING_EMAIL_KEY } from '../context/MyShopContext';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds before "Resend code" can be used again

const emptyCode = () => Array(CODE_LENGTH).fill('');

export default function VerifyEmailPage() {
  const { verifyEmail, resendCode } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  // Email comes from the signup page, or from sessionStorage after a refresh
  const email = location.state?.email || sessionStorage.getItem(PENDING_EMAIL_KEY);

  const [digits, setDigits] = useState(emptyCode);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN); // a code was just sent at signup
  const inputRefs = useRef([]);

  // Focus the first box on load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Count down the resend timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Nobody to verify (e.g. opened the URL directly) -> back to signup
  if (!email) return <Navigate to="/signup" replace />;

  const isComplete = digits.every((d) => d !== '');

  const submitCode = async (code) => {
    if (isVerifying) return;
    setIsVerifying(true);

    const result = await verifyEmail(email, code);

    if (result === 'loggedIn') {
      navigate('/', { replace: true });
      return;
    }
    if (result === 'verified') {
      navigate('/login', { replace: true });
      return;
    }

    // Wrong or expired code: clear the boxes so they can try again
    setIsVerifying(false);
    setDigits(emptyCode());
    inputRefs.current[0]?.focus();
  };

  // Put one or more digits into the boxes starting at `startIndex`
  const fillDigits = (startIndex, chars) => {
    const next = [...digits];
    let i = startIndex;
    for (const ch of chars) {
      if (i >= CODE_LENGTH) break;
      next[i++] = ch;
    }
    setDigits(next);
    inputRefs.current[Math.min(i, CODE_LENGTH - 1)]?.focus();

    // Auto-submit once every box is filled
    if (next.every((d) => d !== '')) submitCode(next.join(''));
  };

  const handleChange = (index, value) => {
    const chars = value.replace(/\D/g, ''); // digits only
    if (!chars) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }
    // More than one char happens with phone autofill of the whole code
    fillDigits(index, chars);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault();
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (index, e) => {
    e.preventDefault();
    const chars = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!chars) return;
    // A full pasted code always starts from the first box
    fillDigits(chars.length >= CODE_LENGTH ? 0 : index, chars);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete) submitCode(digits.join(''));
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    const ok = await resendCode(email);
    setIsResending(false);
    if (ok) {
      setCooldown(RESEND_COOLDOWN);
      setDigits(emptyCode());
      inputRefs.current[0]?.focus();
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-[#1E1E1E] p-8 md:p-10 rounded-3xl w-full max-w-md border border-white/5 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MailCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-gray-400 text-sm">
            We sent a {CODE_LENGTH}-digit code to
            <br />
            <span className="text-white font-semibold break-all">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code boxes */}
          <div className="flex gap-2 md:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                aria-label={`Digit ${index + 1}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => handlePaste(index, e)}
                onFocus={(e) => e.target.select()}
                className="flex-1 min-w-0 h-14 md:h-16 text-center text-2xl font-bold bg-[#2C2C2C] text-white rounded-xl border border-transparent focus:border-primary/50 focus:bg-[#333] outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isComplete || isVerifying}
            className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? <Loader2 className="animate-spin" /> : <>Verify &amp; Continue <ArrowRight size={20} /></>}
          </button>
        </form>

        {/* Resend */}
        <div className="text-center text-sm mt-6">
          <span className="text-gray-400">Didn&apos;t get the code? </span>
          {cooldown > 0 ? (
            <span className="text-gray-500">Resend in {formatTime(cooldown)}</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-primary hover:underline font-bold disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          )}
          <p className="text-gray-500 text-xs mt-2">Check your spam folder too.</p>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          <Link to="/signup" className="inline-flex items-center gap-1 hover:text-white transition">
            <ArrowLeft size={16} /> Wrong email? Go back to sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
