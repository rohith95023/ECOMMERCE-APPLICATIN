import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Incorrect email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (field) =>
    `w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-medium ${
      errors[field]
        ? 'border-red-300 bg-red-50 focus:border-red-400'
        : 'border-slate-50 bg-slate-50 focus:border-indigo-600 focus:bg-white'
    }`;

  return (
    <div className="max-w-[450px] mx-auto pt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card !bg-white p-10 space-y-8"
      >
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mx-auto">
            <Sparkles size={12} />
            Welcome back
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Sign In</h1>
          <p className="text-slate-400 font-medium">Continue your premium pickup experience.</p>
        </div>

        {serverError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3"
          >
            <AlertCircle size={18} className="shrink-0" />
            {serverError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <User
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`}
                size={20}
              />
              <input
                id="login-email"
                type="email"
                className={fieldClass('email')}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); }}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                className="text-[11px] text-red-500 font-semibold ml-1 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`}
                size={20}
              />
              <input
                id="login-password"
                type="password"
                className={fieldClass('password')}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); }}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                className="text-[11px] text-red-500 font-semibold ml-1 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                {errors.password}
              </motion.p>
            )}
          </div>

          <Button disabled={isSubmitting} className="w-full !py-4 shadow-xl shadow-indigo-200 mt-2">
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={18} /> Authenticating...</>
            ) : (
              <>Sign In to Account <ArrowRight size={18} /></>
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm font-medium text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline underline-offset-4">
              Join PickPack now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
