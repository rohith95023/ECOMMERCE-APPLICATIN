import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle, ChevronRight, ShoppingBag, Receipt, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/orders/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Request Received', 
          color: 'text-amber-500 bg-amber-50', 
          icon: Clock,
          desc: 'Your order is in the kitchen queue.' 
        };
      case 'being_packed':
        return { 
          label: 'In Progress', 
          color: 'text-blue-500 bg-blue-50', 
          icon: Package,
          desc: 'Our staff is carefully packing your items.' 
        };
      case 'packed':
        return { 
          label: 'Ready for Pickup', 
          color: 'text-indigo-600 bg-indigo-50', 
          icon: CheckCircle,
          desc: 'Hooray! Come grab your order at the counter.' 
        };
      case 'completed':
        return { 
          label: 'Handed Over', 
          color: 'text-emerald-600 bg-emerald-50', 
          icon: CheckCircle,
          desc: 'Enjoy your fresh items!' 
        };
      default:
        return { 
          label: 'Cancelled', 
          color: 'text-slate-400 bg-slate-50', 
          icon: AlertCircle,
          desc: 'This order was cancelled.' 
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-indigo-600 text-white p-3 rounded-2xl">
          <Receipt size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order <span className="text-indigo-600">History</span></h1>
          <p className="text-slate-400 font-medium">Track your pickup requests in real-time.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="animate-spin mx-auto text-indigo-600 mb-4" size={40} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing with Store...</p>
        </div>
      ) : orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card !p-20 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={40} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">No orders yet</h2>
            <p className="text-slate-400 font-medium">Your order history will appear here once you place one.</p>
          </div>
          <Button className="mt-4 px-10" onClick={() => window.location.href = '/'}>Browse Catalog</Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {orders.map((order, idx) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={order._id}
                  className="glass-card !p-6 group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className={`p-4 rounded-2xl ${statusInfo.color} shrink-0`}>
                        <StatusIcon size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">Order #{order.order_number}</h3>
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium mt-1">{statusInfo.desc}</p>
                        <div className="flex items-center gap-4 mt-3">
                           <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{order.items.length} Items</span>
                           <span className="text-xs font-bold text-slate-900 italic">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-50 pt-4 md:pt-0 gap-2">
                       <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{order.grand_total.toFixed(2)}</span>
                       <Button variant="ghost" className="!p-2 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all !rounded-xl">
                         <ChevronRight size={20} />
                       </Button>
                    </div>
                  </div>
                  
                  {/* Item preview expanded briefly on hover (concept) */}
                  <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                    {order.items.map((item, i) => (
                      <div key={i} className="px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                         {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
