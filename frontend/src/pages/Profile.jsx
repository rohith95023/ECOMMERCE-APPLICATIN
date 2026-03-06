import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, LogOut, Package, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-900 rounded-[2.5rem] p-12 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10" />
         
         <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-black shadow-2xl relative z-10">
            {user.full_name[0]}
         </div>
         
         <div className="flex-grow text-center md:text-left relative z-10">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
               <h1 className="text-4xl font-black tracking-tight">{user.full_name}</h1>
               <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-300 border border-white/5">
                  {user.role}
               </span>
            </div>
            <p className="text-slate-400 font-medium">Customer since {new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
               <Link to="/orders">
                  <Button className="!bg-white !text-slate-900 !rounded-2xl !py-3 !px-6 shadow-xl shadow-black/20">
                     <Package size={18} className="mr-2" /> My Orders
                  </Button>
               </Link>
               <Button variant="ghost" onClick={handleLogout} className="!text-red-400 !rounded-2xl hover:!bg-red-500/10">
                  <LogOut size={18} className="mr-2" /> Sign Out
               </Button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Essential Info */}
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass-card !bg-white space-y-8"
         >
            <div className="flex items-center gap-3">
               <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><User size={20} /></div>
               <h2 className="text-xl font-bold text-slate-900">Personal Details</h2>
            </div>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={18} /></div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</p>
                     <p className="font-bold text-slate-900">{user.email}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={18} /></div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</p>
                     <p className="font-bold text-slate-900">{user.phone}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Shield size={18} /></div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Role</p>
                     <p className="font-bold text-indigo-600 uppercase tracking-tight">{user.role}</p>
                  </div>
               </div>
            </div>
         </motion.div>

         {/* Store Preferences / Security */}
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass-card !bg-white space-y-8"
         >
            <div className="flex items-center gap-3">
               <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><MapPin size={20} /></div>
               <h2 className="text-xl font-bold text-slate-900">Preferences</h2>
            </div>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4 opacity-50">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={18} /></div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Default Store</p>
                     <p className="font-bold text-slate-900">PickPack Main Station</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 opacity-50">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Calendar size={18} /></div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pickup Schedule</p>
                     <p className="font-bold text-slate-900">As soon as ready</p>
                  </div>
               </div>
               
               <div className="pt-4 border-t border-slate-50">
                  <Button variant="outline" className="w-full !rounded-2xl opacity-50 cursor-not-allowed">Edit Preferences</Button>
               </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
};

export default Profile;
