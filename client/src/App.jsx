import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Search, Zap, LayoutGrid, Image as ImageIcon, Menu, Github } from 'lucide-react';
import RippleButton from './components/RippleButton';
import UploadModal from './components/UploadModal';
import GalleryPage from './pages/GalleryPage';
import axios from 'axios';

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/images');
        setImages(response.data);
      } catch (err) {
        console.error('System Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    })
  };

  return (
    <div className="app-main">
      <nav className="navbar">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            SNAP_SHARE
          </motion.div>
        </Link>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '0.4rem 1rem', border: '1px solid var(--glass-border)' }}>
             <Search size={16} color="#888" />
             <input type="text" placeholder="SEARCH OS..." style={{ background: 'none', border: 'none', color: 'white', paddingLeft: '0.5rem', outline: 'none', fontSize: '0.8rem', fontFamily: 'var(--pixel-font)' }} />
          </div>
          <RippleButton onClick={() => setIsModalOpen(true)}>
             UPLOAD_DATA
          </RippleButton>
          <Menu className="icon-btn" size={20} />
        </div>
      </nav>

      <main>
        <section className="hero" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ marginBottom: '2rem' }}
          >
            <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(0, 243, 255, 0.1)', color: 'var(--neon-cyan)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid rgba(0, 243, 255, 0.2)', marginBottom: '1rem', fontFamily: 'var(--pixel-font)' }}>
              SYSTEM READY_V1.0
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ fontSize: 'clamp(2.5rem, 10vw, 6rem)', lineHeight: 1, textShadow: '0 0 20px rgba(157, 0, 255, 0.5)' }}
            >
              PIXEL_STORY <br/> EVOLUTION
            </motion.h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 4rem auto', fontSize: '1.2rem', fontWeight: '300' }}
          >
            A futuristic vision of image sharing. Built for the modern web with high-fidelity glassmorphism and smooth pixel interactions.
          </motion.p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem' }}>
             {[Zap, ImageIcon, LayoutGrid, Github].map((Icon, idx) => (
               <motion.div
                 key={idx}
                 whileHover={{ y: -10, color: '#00f3ff' }}
                 style={{ color: '#444', transition: '0.3s', cursor: 'pointer' }}
               >
                 <Icon size={32} />
               </motion.div>
             ))}
          </div>
        </section>

        <section id="feed" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderLeft: '4px solid var(--neon-cyan)', paddingLeft: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>DATA_FEED</h3>
                <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem' }}>PROTOCOL: SH_FETCH_200</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <button className="icon-btn" style={{ padding: '0.8rem' }}>LATEST</button>
                 <button className="icon-btn" style={{ padding: '0.8rem' }}>TRENDING</button>
              </div>
           </div>

           {loading ? (
             <div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
               <motion.div
                 animate={{ rotate: 360, borderColor: ['#00f3ff', '#9d00ff', '#ff00ff', '#00f3ff'] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                 style={{ width: 60, height: 60, border: '4px solid #fff', borderRadius: '50%', borderTopWidth: '8px' }}
               />
               <p style={{ marginTop: '2rem', fontFamily: 'var(--pixel-font)', fontSize: '0.9rem', letterSpacing: '2px', color: 'var(--neon-cyan)' }}>SYNCING_PROTOCOLS...</p>
             </div>
           ) : (
             <div className="grid-container">
               <AnimatePresence>
                 {(images.length > 0 ? images : []).map((img, i) => (
                   <motion.div
                     key={img._id || i}
                     className="glass-card image-card"
                     custom={i}
                     variants={cardVariants}
                     initial="hidden"
                     animate="visible"
                     whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 243, 255, 0.4)" }}
                     style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}
                   >
                     <div style={{ overflow: 'hidden', height: '300px' }}>
                        <Link to={`/gallery/${img.uniqueId}`}>
                          <motion.img 
                            src={img.imageUrl} 
                            alt={img.title} 
                            loading="lazy"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Link>
                     </div>
                     <div style={{ padding: '1.5rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <h4 style={{ fontSize: '1.1rem', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{img.title}</h4>
                         <motion.div 
                           whileHover={{ scale: 1.3 }}
                           whileTap={{ scale: 0.7 }}
                           style={{ cursor: 'pointer', color: '#ff00ff', display: 'flex', alignItems: 'center', gap: '5px' }}
                         >
                            <Heart size={18} fill="rgba(255,0,255,0.2)" />
                            <span style={{ fontSize: '0.7rem', color: '#888', fontFamily: 'var(--pixel-font)' }}>{img.likes}</span>
                         </motion.div>
                       </div>
                       
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                          <span style={{ fontSize: '0.7rem', color: '#666', fontFamily: 'var(--pixel-font)' }}>
                            @{img.author}
                          </span>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="icon-btn">
                              <Share2 size={16} />
                            </motion.button>
                            <Link to={`/gallery/${img.uniqueId}`}>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="icon-btn">
                                <ImageIcon size={16} />
                              </motion.button>
                            </Link>
                          </div>
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>
           )}
        </section>

        <section style={{ padding: '10rem 2rem', textAlign: 'center' }}>
           <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(157, 0, 255, 0.1) 100%)', padding: '4rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>UPGRADE_SECURITY</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Join the premium network of creators and philosophers.</p>
              <RippleButton style={{ padding: '1.5rem 3rem', fontSize: '1rem' }}>
                ACCESS_NETWORK_KEY
              </RippleButton>
           </div>
        </section>
      </main>

      <footer style={{ padding: '8rem 2rem 4rem 2rem', borderTop: '1px solid var(--glass-border)', marginTop: '10rem', background: 'rgba(0,0,0,0.5)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>
           <div>
             <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>SNAP_SHARE</h4>
             <p style={{ color: '#555', fontSize: '0.9rem' }}>The future of high-fidelity pixels and digital expression.</p>
           </div>
           <div>
             <h4 style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1.5rem' }}>SYSTEM</h4>
             <ul style={{ listStyle: 'none', color: '#555', fontSize: '0.8rem', lineHeight: '2' }}>
               <li>STATUS: ONLINE</li>
               <li>VERSION: 4.2.0</li>
               <li>LATENCY: 12ms</li>
             </ul>
           </div>
           <div>
             <h4 style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1.5rem' }}>PROTOCOL</h4>
             <ul style={{ listStyle: 'none', color: '#555', fontSize: '0.8rem', lineHeight: '2' }}>
               <li>TERMS_OF_OS</li>
               <li>PRIVACY_ENCRYPTION</li>
               <li>LEGAL_VOID</li>
             </ul>
           </div>
           <div>
             <h4 style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1.5rem' }}>CONNECT</h4>
             <div style={{ display: 'flex', gap: '1rem' }}>
                <Github size={18} color="#555" />
                <Zap size={18} color="#555" />
                <ImageIcon size={18} color="#555" />
             </div>
           </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '6rem', color: '#333', fontSize: '0.7rem', fontFamily: 'var(--pixel-font)' }}>
          PROTO_COL_SNAP_SHARE_2026 // ALL_RIGHTS_RESERVED
        </div>
      </footer>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery/:id" element={<GalleryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
