import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, ShoppingCart, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products')
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center text-center space-y-8 py-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-indigo-500/10 blur-[120px] -z-10 rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest"
        >
          <Sparkles size={14} />
          New Experience
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9]"
        >
          Modern <span className="text-gradient">Shopping,</span> <br /> 
          Classic <span className="text-indigo-600">Pickup.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 max-w-xl mx-auto font-medium"
        >
          Browse our curated catalog, order with a tap, and enjoy friction-less pickup. Experience the future of retail today.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-2xl mx-auto relative mt-8 group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[28px] blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
          <div className="relative flex items-center bg-white rounded-3xl p-1 shadow-2xl">
            <Search className="ml-6 text-slate-400" size={20} />
            <input 
              className="w-full px-4 py-5 bg-transparent border-none outline-none text-lg font-medium placeholder:text-slate-400"
              placeholder="What are you looking for today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="hidden sm:flex mr-1.5 px-8 !rounded-2xl">Find Items</Button>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="space-y-10 group">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore curated <span className="text-indigo-600">Collections</span></h2>
            <p className="text-slate-400 font-medium">Find exactly what you need in seconds.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" className="!p-3 !rounded-xl">
               <Filter size={18} />
            </Button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${!selectedCategory ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
          >
            All Products
          </button>
          <AnimatePresence>
            {categories.map(cat => (
              <motion.button 
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap border-2 ${selectedCategory === cat._id ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border-transparent shadow-sm'}`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.name}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Products Grid */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {selectedCategory ? categories.find(c => c._id === selectedCategory)?.name : 'Trending Products'}
            </h2>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">{filteredProducts.length} items</span>
          </div>
          <Link to="/" className="text-indigo-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-[400px] bg-white rounded-4xl animate-pulse shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  key={product._id}
                  className="glass-card !bg-white group"
                >
                  <div className="h-64 relative overflow-hidden bg-slate-100 m-2 rounded-[22px]">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase text-indigo-600 tracking-widest shadow-xl">
                        {product.unit}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-2 space-y-4">
                    <div>
                      <h3 className="font-bold text-xl text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-slate-400 font-medium line-clamp-2 mt-1">{product.description || 'Curated high-quality selection just for you.'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">Pricing</span>
                        <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                      </div>
                      <Button 
                        onClick={() => addToCart(product)}
                        className="!p-3.5 !rounded-2xl"
                      >
                        <ShoppingCart size={20} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="py-24 text-center glass-card border-dashed">
             <div className="text-slate-300 mb-4 flex justify-center"><Search size={48} /></div>
             <h3 className="text-xl font-bold text-slate-900">No items found</h3>
             <p className="text-slate-400 mt-1 font-medium">Try adjusting your search or category filters.</p>
             <Button variant="outline" onClick={() => {setSearchQuery(''); setSelectedCategory(null);}} className="mt-6">Clear All Filters</Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
