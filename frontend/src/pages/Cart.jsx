import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, Sparkles, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        notes: "Pickup requested",
        pickup_time: new Date(Date.now() + 30 * 60000).toISOString() // 30 mins from now
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/orders/', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrderSuccess(response.data);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card !p-12 space-y-8"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <Package size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Confirmed!</h1>
            <p className="text-slate-500 font-medium">Your order <span className="text-indigo-600 font-bold">#{orderSuccess.order_number}</span> has been received.</p>
          </div>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Our team is preparing your items. You'll receive a notification when it's ready for pickup.
          </p>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
             <Link to="/orders">
               <Button className="w-full">Track Order Status</Button>
             </Link>
             <Link to="/">
               <Button variant="outline" className="w-full">Return to Catalog</Button>
             </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-slate-900 text-white p-3 rounded-2xl">
          <ShoppingBag size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your <span className="text-indigo-600">Cart</span></h1>
          <p className="text-slate-400 font-medium">Review your items before checkout.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card !p-20 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={40} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
            <p className="text-slate-400 font-medium">Looks like you haven't added anything yet.</p>
          </div>
          <Link to="/">
            <Button className="mt-4 px-10">Start Shopping</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item._id}
                  className="glass-card !p-4 flex gap-6 group"
                >
                  <div className="w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                    <img 
                      src={item.image_url || `https://source.unsplash.com/featured/?${item.name.replace(' ', ',')}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={item.name} 
                    />
                  </div>
                  <div className="flex-grow py-2 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl text-slate-900 tracking-tight">{item.name}</h3>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">₹{item.price} / {item.unit}</p>
                      </div>
                      <button 
                         onClick={() => removeFromCart(item._id)}
                         className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                         <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button 
                          onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-black text-slate-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-xl font-black text-slate-900">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="glass-card !bg-slate-900 !text-white !p-8 space-y-8 sticky top-32"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="text-indigo-400" />
                <h2 className="text-xl font-bold tracking-tight">Order Summary</h2>
              </div>

              <div className="space-y-4 border-b border-white/10 pb-8">
                <div className="flex justify-between font-medium text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-slate-400">
                  <span>Tax (GST 5%)</span>
                  <span className="text-white">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-3xl font-black">
                <span className="tracking-tighter">Total</span>
                <span className="text-indigo-400">₹{total.toFixed(2)}</span>
              </div>

              <div className="space-y-4 pt-4">
                 <div className="bg-white/5 rounded-2xl p-4 flex gap-3 text-sm text-slate-400">
                    <Sparkles className="text-indigo-400" size={18} />
                    <span>Free pickup at store in 30 mins.</span>
                 </div>

                 {error && (
                   <p className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>
                 )}

                 <Button 
                    variant="primary" 
                    className="w-full !bg-white !text-slate-900 !py-4 shadow-2xl shadow-indigo-500/10"
                    onClick={handleCheckout}
                    disabled={loading}
                 >
                    {loading ? 'Processing...' : (
                      <>
                        Place Order Now
                        <ArrowRight size={20} />
                      </>
                    )}
                 </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
