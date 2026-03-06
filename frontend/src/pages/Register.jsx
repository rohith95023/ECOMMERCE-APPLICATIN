import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ''));

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.full_name.trim()) e.full_name = 'Full name is required';
    else if (formData.full_name.trim().length < 2) e.full_name = 'Name must be at least 2 characters';

    if (!formData.email.trim()) e.email = 'Email address is required';
    else if (!validateEmail(formData.email)) e.email = 'Enter a valid email address';

    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number';

    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 8) e.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password)) e.password = 'Must contain at least one uppercase letter';
    else if (!/[0-9]/.test(formData.password)) e.password = 'Must contain at least one number';

    if (!formData.confirm_password) e.confirm_password = 'Please confirm your password';
    else if (formData.password !== formData.confirm_password) e.confirm_password = 'Passwords do not match';

    return e;
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
      await register(formData);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (field) =>
    `w-full py-3.5 rounded-2xl border-2 outline-none transition-all font-medium text-sm ${
      errors[field]
        ? 'border-red-300 bg-red-50 focus:border-red-400'
        : 'border-slate-50 bg-slate-50 focus:border-indigo-600 focus:bg-white'
    }`;

  const FieldError = ({ field }) =>
    errors[field] ? (
      <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        className="text-[11px] text-red-500 font-semibold ml-1 mt-1 flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-red-500 inline-block shrink-0" />
        {errors[field]}
      </motion.p>
    ) : null;

  return (
    <div className="max-w-[520px] mx-auto pt-10 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card !bg-white p-10 space-y-8"
      >
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mx-auto">
            <ShieldCheck size={12} />
            Join the elite
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Create Account</h1>
          <p className="text-slate-400 font-medium">Be part of the modern pickup revolution.</p>
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
          {/* Full Name */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-1.5">Full Name</label>
            <div className="relative group">
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.full_name ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} size={18} />
              <input name="full_name" className={`${fieldClass('full_name')} pl-11 pr-4`}
                placeholder="John Doe" value={formData.full_name} onChange={handleChange} />
            </div>
            <FieldError field="full_name" />
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-1.5">Email Address</label>
            <div className="relative group">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} size={18} />
              <input name="email" type="email" className={`${fieldClass('email')} pl-11 pr-4`}
                placeholder="name@example.com" value={formData.email} onChange={handleChange} autoComplete="email" />
            </div>
            <FieldError field="email" />
          </div>

          {/* Phone */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-1.5">Mobile Number</label>
            <div className="relative group">
              <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} size={18} />
              <input name="phone" type="tel" className={`${fieldClass('phone')} pl-11 pr-4`}
                placeholder="9876543210" value={formData.phone} onChange={handleChange} maxLength={10} />
            </div>
            <FieldError field="phone" />
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-1.5">Password</label>
              <input name="password" type="password" className={`${fieldClass('password')} px-4`}
                placeholder="Min 8 chars, 1 upper, 1 number" value={formData.password} onChange={handleChange} />
              <FieldError field="password" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-1.5">Confirm</label>
              <input name="confirm_password" type="password" className={`${fieldClass('confirm_password')} px-4`}
                placeholder="Re-enter password" value={formData.confirm_password} onChange={handleChange} />
              <FieldError field="confirm_password" />
            </div>
          </div>

          {/* Password strength indicator */}
          {formData.password.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                {[...Array(4)].map((_, i) => {
                  const strength = [formData.password.length >= 8, /[A-Z]/.test(formData.password), /[0-9]/.test(formData.password), /[^A-Za-z0-9]/.test(formData.password)].filter(Boolean).length;
                  return <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < strength ? strength <= 1 ? 'bg-red-400' : strength <= 2 ? 'bg-amber-400' : strength <= 3 ? 'bg-indigo-400' : 'bg-emerald-500' : 'bg-slate-100'}`} />;
                })}
              </div>
              <p className="text-[10px] text-slate-400 font-medium ml-1">
                {(() => {
                  const s = [formData.password.length >= 8, /[A-Z]/.test(formData.password), /[0-9]/.test(formData.password), /[^A-Za-z0-9]/.test(formData.password)].filter(Boolean).length;
                  return ['', 'Weak — add uppercase & numbers', 'Fair', 'Good', 'Strong password!'][s];
                })()}
              </p>
            </div>
          )}

          <Button disabled={isSubmitting} className="w-full !py-4 shadow-xl shadow-indigo-200 mt-2">
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={18} /> Creating Profile...</>
            ) : (
              <>Start Your Journey <ArrowRight size={18} /></>
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm font-medium text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
