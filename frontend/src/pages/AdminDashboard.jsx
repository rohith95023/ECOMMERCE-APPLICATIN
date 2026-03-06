import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, CheckCircle, Clock, AlertCircle, TrendingUp, Users, ShoppingBag, 
  LayoutDashboard, Search, Loader2, Plus, Edit3, Trash2, X, Image as ImageIcon,
  Tag, Activity, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';

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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'inventory'
  const [orderFilter, setOrderFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: '1kg',
    category_id: '',
    image_url: '',
    is_available: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/orders/', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/products?include_hidden=true'),
        axios.get('/api/categories')
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/orders/${orderId}/status?status=${newStatus}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/products', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', unit: '1kg', category_id: '', image_url: '', is_available: true });
      fetchData();
    } catch (err) {
      console.error("Failed to save product", err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      unit: product.unit,
      category_id: product.category_id,
      image_url: product.image_url || '',
      is_available: product.is_available
    });
    setIsModalOpen(true);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((acc, o) => acc + o.grand_total, 0)
  };

  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);

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
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl text-xs font-black">
               PICKPACK
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Owner <span className="text-indigo-600">Hub</span></h1>
          </div>
          <p className="text-slate-400 font-medium">Control center for orders and inventory management.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-2xl flex border border-slate-200">
             <button 
               onClick={() => setActiveTab('orders')}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Live Orders
             </button>
             <button 
               onClick={() => setActiveTab('inventory')}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Inventory
             </button>
          </div>
          {activeTab === 'inventory' && (
            <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="!rounded-2xl !py-3">
               <Plus size={20} className="mr-2" /> Add Product
            </Button>
          )}
        </div>
      </div>

      {activeTab === 'orders' ? (
        <>
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
                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">Live Orders</h2>
                 <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">Real-time</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                    {['all', 'pending', 'being_packed', 'completed'].map((f) => (
                      <button 
                        key={f}
                        onClick={() => setOrderFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${orderFilter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
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
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Order</th>
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
                        layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        key={order._id} className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="font-black text-slate-900">#{order.order_number}</span>
                          <p className="text-[10px] text-slate-400 font-medium mt-1">{new Date(order.created_at).toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-slate-600">ID: {order.customer_id.substring(0, 8)}...</td>
                        <td className="px-8 py-6">
                           <span className="font-bold text-slate-900">{order.items.length} items</span>
                        </td>
                        <td className="px-8 py-6 font-black text-slate-900">₹{order.grand_total.toFixed(2)}</td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-opacity-10 ${getStatusColor(order.status)}`}>
                             {order.status.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            {order.status === 'pending' && (
                              <Button onClick={() => updateOrderStatus(order._id, 'being_packed')} className="!px-3 !py-1.5 !text-[10px] !rounded-lg">
                                 Pack Order
                              </Button>
                            )}
                            {order.status === 'being_packed' && (
                              <Button onClick={() => updateOrderStatus(order._id, 'completed')} className="!px-3 !py-1.5 !text-[10px] !rounded-lg !bg-emerald-600">
                                 Mark Pickup
                              </Button>
                            )}
                            {order.status === 'completed' && (
                              <div className="text-emerald-500 flex items-center gap-1 font-bold text-xs"><CheckCircle size={16} /> Ready</div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence>
             {products.map((product) => (
               <motion.div 
                 layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 key={product._id} className="glass-card !bg-white group"
               >
                 <div className="h-48 relative overflow-hidden bg-slate-50 m-2 rounded-2xl">
                    <img 
                      src={product.image_url || `https://source.unsplash.com/featured/?${product.name}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={product.name}
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                       <button 
                         onClick={() => openEditModal(product)}
                         className="p-2 bg-white/90 backdrop-blur rounded-xl text-slate-600 hover:text-indigo-600 shadow-sm transition-all"
                       >
                          <Edit3 size={16} />
                       </button>
                       <button 
                         onClick={() => deleteProduct(product._id)}
                         className="p-2 bg-white/90 backdrop-blur rounded-xl text-slate-600 hover:text-red-500 shadow-sm transition-all"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                       <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${product.is_available ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                          {product.is_available ? 'In Stock' : 'Out of Stock'}
                       </span>
                    </div>
                 </div>
                 <div className="p-5">
                    <div className="flex justify-between items-start mb-1">
                       <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{product.name}</h3>
                       <span className="font-black text-indigo-600 text-lg">₹{product.price}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium line-clamp-2 min-h-[2rem]">{product.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <Tag size={12} />
                       {categories.find(c => c._id === product.category_id)?.name || 'Uncategorized'}
                       <span className="mx-2">•</span>
                       <Activity size={12} />
                       {product.unit}
                    </div>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      )}

      {/* Modal for Product Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
               onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative glass-card !bg-white w-full max-w-xl !p-0 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                   {editingProduct ? 'Edit' : 'Add New'} <span className="text-indigo-600">Product</span>
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                    <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleProductSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Input 
                    label="Product Name" 
                    placeholder="e.g. Fresh Mangoes"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <select 
                      className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-indigo-600 focus:bg-white transition-all text-sm font-medium"
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Input 
                    label="Price (₹)" 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                  <Input 
                    label="Unit" 
                    placeholder="e.g. 1kg, 500g, 1 Dozen"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                   <textarea 
                     className="w-full p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-indigo-600 focus:bg-white transition-all text-sm font-medium h-24 resize-none"
                     placeholder="Tell customers more about this item..."
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                </div>

                <Input 
                  label="Image URL" 
                  icon={ImageIcon}
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                />

                <div className="flex items-center gap-3 pt-2">
                   <button 
                     type="button"
                     onClick={() => setFormData({...formData, is_available: !formData.is_available})}
                     className={`w-12 h-6 rounded-full transition-all relative ${formData.is_available ? 'bg-indigo-600' : 'bg-slate-200'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.is_available ? 'left-7' : 'left-1'}`} />
                   </button>
                   <span className="text-xs font-bold text-slate-600">Mark as Available in Catalog</span>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button type="submit" className="flex-grow !py-4">
                     {editingProduct ? 'Update Product' : 'Add to Collection'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="!px-8">
                     Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="fixed inset-0 z-[110] bg-white/50 backdrop-blur-sm flex items-center justify-center">
           <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
