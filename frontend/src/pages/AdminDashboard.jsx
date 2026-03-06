import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, CheckCircle, Clock, AlertCircle, TrendingUp, Users, ShoppingBag, LayoutDashboard, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card !p-6 flex items-center gap-6 group hover:bg-slate-900 transition-all duration-500"
  >
    <div className={`p-4 rounded-2xl ${color} bg-opacity-10 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-bold text-slate-400 group-hover:text-slate-500 transition-colors uppercase tracking-widest">{title}</p>
      <p className="text-3xl font-black text-slate-900 group-hover:text-white transition-colors tracking-tight">{value}</p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/orders/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/orders/${orderId}/status?status=${newStatus}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((acc, o) => acc + o.grand_total, 0)
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500 text-amber-500';
      case 'being_packed': return 'bg-blue-500 text-blue-500';
      case 'packed': return 'bg-indigo-500 text-indigo-500';
      case 'completed': return 'bg-emerald-500 text-emerald-500';
      default: return 'bg-slate-500 text-slate-500';
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
               <LayoutDashboard size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Owner <span className="text-indigo-600">Dashboard</span></h1>
          </div>
          <p className="text-slate-400 font-medium">Manage orders, track performance, and grow your business.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="!px-5 !py-2.5 !text-sm">Download Report</Button>
          <Button className="!px-5 !py-2.5 !text-sm">Manage Catalog</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Orders" value={stats.total} icon={ShoppingBag} color="text-indigo-600 bg-indigo-600" delay={0.1} />
        <StatCard title="Pending Pickup" value={stats.pending} icon={Clock} color="text-amber-500 bg-amber-500" delay={0.2} />
        <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={TrendingUp} color="text-emerald-500 bg-emerald-500" delay={0.3} />
        <StatCard title="Loyal Customers" value="84" icon={Users} color="text-blue-500 bg-blue-500" delay={0.4} />
      </div>

      {/* Orders Table Section */}
      <div className="glass-card !bg-white !p-0">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-2">
             <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Live Orders</h2>
             <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">Live</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input className="pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-600 text-sm font-medium w-64" placeholder="Search order ID..." />
             </div>
             <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                {['all', 'pending', 'being_packed', 'completed'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Items</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={order._id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <span className="font-bold text-slate-900">#{order.order_number}</span>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">{new Date(order.created_at).toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6 capitalize font-medium text-slate-600">User ID: {order.customer_id.substring(0, 8)}...</td>
                    <td className="px-8 py-6">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-8 h-8 rounded-lg bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-600">
                             {item.name[0]}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900">₹{order.grand_total.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-opacity-10 ${getStatusColor(order.status)}`}>
                         <div className="w-1 h-1 rounded-full bg-current" />
                         {order.status.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {order.status === 'pending' && (
                          <Button 
                             onClick={() => updateStatus(order._id, 'being_packed')}
                             className="!px-3 !py-1.5 !text-[10px] !rounded-lg"
                          >
                             Start Packing
                          </Button>
                        )}
                        {order.status === 'being_packed' && (
                          <Button 
                             onClick={() => updateStatus(order._id, 'completed')}
                             className="!px-3 !py-1.5 !text-[10px] !rounded-lg !bg-emerald-600"
                          >
                             Complete
                          </Button>
                        )}
                        {order.status === 'completed' && (
                          <span className="text-emerald-500"><CheckCircle size={20} /></span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {loading && (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin mx-auto text-slate-200 mb-4" size={40} />
            <p className="text-slate-300 font-bold tracking-widest uppercase text-xs">Syncing Live Data...</p>
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="p-20 text-center">
            <AlertCircle className="mx-auto text-slate-100 mb-4" size={48} />
            <p className="text-slate-400 font-medium">No orders found matching this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
