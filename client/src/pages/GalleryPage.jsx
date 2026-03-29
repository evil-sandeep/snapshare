import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, ArrowLeft, Download, ShieldCheck, Zap, Maximize2 } from 'lucide-react';
import axios from 'axios';
import RippleButton from '../components/RippleButton';
import PixelLoader from '../components/PixelLoader';

const GalleryPage = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProtected, setIsProtected] = useState(false);
  const [passKey, setPassKey] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/gallery/${id}`);
        if (response.data.protected) {
           setIsProtected(true);
           setImage(response.data);
        } else {
           setImage(response.data);
        }
      } catch (err) {
        console.error('System Error:', err);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };
    fetchImage();
  }, [id]);

  const handleVerify = async () => {
     setVerifying(true);
     try {
        const response = await axios.post(`http://localhost:5000/api/gallery/${id}/verify`, { password: passKey });
        setImage(response.data);
        setIsProtected(false);
     } catch (err) {
        alert('AUTH_FAILED: Invalid Pass Key');
     } finally {
        setVerifying(false);
     }
  };

  if (loading) {
    // ... same loading code
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505' }}>
        <PixelLoader text="INITIALIZING_SECURE_TUNNEL" />
      </div>
    );
  }

  if (isProtected) {
     return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505', padding: '2rem' }}>
           <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(157, 0, 255, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="glass-card" 
             style={{ width: '100%', maxWidth: '450px', padding: '3rem', textAlign: 'center' }}
           >
              <div style={{ color: 'var(--neon-purple)', marginBottom: '2rem' }}>
                 <ShieldCheck size={48} />
              </div>
              <h2 style={{ fontFamily: 'var(--pixel-font)', fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '4px' }}>DATA_LOCKED</h2>
              <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '2.5rem' }}>This gallery is protected by an encryption key.</p>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
                <input 
                  type="password" 
                  placeholder="ENTER_PASS_KEY" 
                  value={passKey}
                  onChange={(e) => setPassKey(e.target.value)}
                  style={{ width: '100%', background: 'none', border: 'none', color: 'white', padding: '1.2rem', outline: 'none', textAlign: 'center', fontFamily: 'var(--pixel-font)', fontSize: '0.9rem' }}
                />
              </div>

              <RippleButton onClick={handleVerify} disabled={verifying} style={{ width: '100%' }}>
                 {verifying ? 'DECRYPTING...' : 'COMMAND: UNLOCK_DATA'}
              </RippleButton>
              
              <div style={{ marginTop: '2rem' }}>
                <Link to="/" style={{ color: '#333', fontSize: '0.65rem', textDecoration: 'none', fontFamily: 'var(--pixel-font)' }}>ABORT_MISSION</Link>
              </div>
           </motion.div>
        </div>
     );
  }

  if (!image) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#050505', color: '#888' }}>
        <h2 style={{ fontFamily: 'var(--pixel-font)', color: '#f00' }}>404_DATA_NOT_FOUND</h2>
        <Link to="/" style={{ marginTop: '2rem', color: 'var(--neon-cyan)', textDecoration: 'none' }}>RETURN_TO_BASE</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      {/* ... previous content ... */}
      <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.03) 0%, transparent 50%)', pointerEvents: 'none' }} />
      
      <nav style={{ maxWidth: '1200px', margin: '0 auto 4rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'var(--pixel-font)' }}>
          <ArrowLeft size={16} /> BACK_TO_FEED
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neon-cyan)', fontSize: '0.7rem', opacity: 0.6 }}>
              <ShieldCheck size={16} /> VERIFIED_CHANNEL
           </div>
           <div style={{ width: '1px', height: '15px', background: 'rgba(255,255,255,0.1)' }} />
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neon-purple)', fontSize: '0.7rem', opacity: 0.6 }}>
              <Zap size={16} /> SYNC_COMPLETE
           </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: '4rem', alignItems: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            style={{ 
              background: 'rgba(255, 255, 255, 0.01)', 
              padding: '0.5rem', 
              borderRadius: '28px', 
              border: '1px solid rgba(0, 243, 255, 0.1)',
              boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5), 0 0 20px rgba(0, 243, 255, 0.05)',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: '-10px', left: '-10px', padding: '0.5rem 1rem', background: 'var(--neon-cyan)', color: 'black', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold', fontFamily: 'var(--pixel-font)', boxShadow: '0 0 15px rgba(0, 243, 255, 0.5)' }}>
              PIXEL_STREAM_ACTIVE
            </div>
            <img src={image.imageUrl} alt={image.title} style={{ width: '100%', borderRadius: '24px', display: 'block', border: '1px solid rgba(255,255,255,0.05)' }} />
          </motion.div>

          <div style={{ padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ background: 'rgba(0, 243, 255, 0.1)', color: 'var(--neon-cyan)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.6rem', fontFamily: 'var(--pixel-font)', letterSpacing: '1px' }}>
                    KEY: {image.uniqueId}
                 </div>
                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0f0', boxShadow: '0 0 10px #0f0' }} />
                 <span style={{ fontSize: '0.6rem', color: '#555', fontFamily: 'var(--pixel-font)' }}>ONLINE</span>
              </div>

              <h1 style={{ fontSize: '3.5rem', margin: '0 0 1.5rem 0', lineHeight: 1, letterSpacing: '-2px', textShadow: '0 0 30px rgba(255,255,255,0.1)' }}>
                {image.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(45deg, #00f3ff, #9d00ff)', padding: '2px' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Zap size={20} color="var(--neon-cyan)" />
                  </div>
                </div>
                <div>
                   <p style={{ margin: 0, fontSize: '0.7rem', color: '#666', marginBottom: '0.2rem' }}>DATA_SOURCE</p>
                   <p style={{ margin: 0, fontSize: '1.1rem', color: 'white', fontWeight: 'bold' }}>@{image.author}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3.5rem' }}>
                 <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ff00ff', marginBottom: '0.8rem' }}>
                       <Heart size={16} fill="#ff00ff" />
                       <span style={{ fontSize: '0.65rem', color: '#555', fontFamily: 'var(--pixel-font)' }}>RATING</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', color: 'white' }}>{image.likes}</div>
                 </div>
                 <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--neon-cyan)', marginBottom: '0.8rem' }}>
                       <Maximize2 size={16} />
                       <span style={{ fontSize: '0.65rem', color: '#555', fontFamily: 'var(--pixel-font)' }}>OS_VER</span>
                    </div>
                    <div style={{ fontSize: '1.2rem', color: 'white', fontFamily: 'var(--pixel-font)', marginTop: '0.5rem' }}>V4.2.1</div>
                 </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <RippleButton 
                  onClick={() => {
                     const filename = `${image.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${image.uniqueId}.jpg`;
                     window.location.href = `http://localhost:5000/api/proxy-download?url=${encodeURIComponent(image.imageUrl)}&filename=${filename}`;
                  }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1.4rem', fontSize: '1rem' }}
                >
                  <Download size={22} /> DOWNLOAD_PIXEL_SOURCE
                </RippleButton>
                <RippleButton 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1.3rem', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#888' }}
                >
                  <Share2 size={18} /> INITIALIZE_DISTRIBUTION_PROTOCOL
                </RippleButton>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer style={{ marginTop: '8rem', textAlign: 'center', color: '#222', fontSize: '0.6rem', fontFamily: 'var(--pixel-font)', letterSpacing: '4px', position: 'relative', zIndex: 10 }}>
         // ENCRYPTION_LAYER_6 // SYSTEM_ID: {image._id} // SNAP_SHARE_QUANTUM_CORE
      </footer>
    </div>
  );
};

export default GalleryPage;

