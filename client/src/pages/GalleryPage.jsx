import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, ArrowLeft, Download, ShieldCheck, Zap, Maximize2 } from 'lucide-react';
import axios from 'axios';
import RippleButton from '../components/RippleButton';
import PixelLoader from '../components/PixelLoader';

const GalleryPage = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProtected, setIsProtected] = useState(false);
  const [passKey, setPassKey] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/gallery/${id}`);
        if (response.data.protected) {
           setIsProtected(true);
           setGallery(response.data);
        } else {
           setGallery(response.data);
        }
      } catch (err) {
        console.error('System Error:', err);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };
    fetchGallery();
  }, [id]);

  const handleVerify = async () => {
     setVerifying(true);
     try {
        const response = await axios.post(`http://localhost:5000/api/gallery/${id}/verify`, { password: passKey });
        setGallery(response.data);
        setIsProtected(false);
     } catch (err) {
        alert('AUTH_FAILED: Invalid Pass Key');
     } finally {
        setVerifying(false);
     }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505' }}>
        <PixelLoader text="SYNCING_BATCH_DATA" />
      </div>
    );
  }

  if (isProtected) {
     return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505', padding: '2rem' }}>
           <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(157, 0, 255, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem', textAlign: 'center' }}>
              <ShieldCheck size={48} color="var(--neon-purple)" style={{ marginBottom: '2rem' }} />
              <h2 style={{ fontFamily: 'var(--pixel-font)', fontSize: '1.2rem', marginBottom: '1rem' }}>BATCH_LOCKED</h2>
              <input type="password" placeholder="ENTER_PASS_KEY" value={passKey} onChange={(e) => setPassKey(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '1.2rem', outline: 'none', textAlign: 'center', fontFamily: 'var(--pixel-font)', borderRadius: '12px', marginBottom: '2rem' }} />
              <RippleButton onClick={handleVerify} disabled={verifying} style={{ width: '100%' }}>{verifying ? 'DECRYPTING...' : 'COMMAND: UNLOCK_BATCH'}</RippleButton>
           </motion.div>
        </div>
     );
  }

  if (!gallery) {
    return (
       <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#050505' }}>
          <h2 style={{ fontFamily: 'var(--pixel-font)', color: '#f00' }}>404_DATA_NOT_FOUND</h2>
          <Link to="/" style={{ marginTop: '2rem', color: 'var(--neon-cyan)', textDecoration: 'none' }}>RETURN_TO_BASE</Link>
       </div>
    );
  }

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', padding: '2rem' }}>
      <nav style={{ maxWidth: '1400px', margin: '0 auto 4rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'var(--pixel-font)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> BACK_TO_FEED
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
           <div style={{ fontSize: '0.7rem', color: '#555', fontFamily: 'var(--pixel-font)' }}>UNITS: {gallery.images.length}</div>
           <RippleButton style={{ padding: '0.6rem 1.2rem', fontSize: '0.7rem' }}>DOWNLOAD_BATCH_ZIP</RippleButton>
        </div>
      </nav>

      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '6rem', borderLeft: '4px solid var(--neon-cyan)', paddingLeft: '2rem' }}>
           <div style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)', marginBottom: '1rem', fontFamily: 'var(--pixel-font)' }}>COLLECTION_MANIFEST_V1.1</div>
           <h1 style={{ fontSize: '4rem', margin: 0, lineHeight: 1 }}>{gallery.title}</h1>
           <p style={{ color: '#555', marginTop: '1rem', fontSize: '1.1rem' }}>Sourced by <span style={{ color: 'white' }}>@{gallery.author}</span> // Protocol ID: {gallery.uniqueId}</p>
        </div>

        <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
           {gallery.images.map((img, i) => (
             <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ marginBottom: '2rem', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                <img src={img.url} alt={img.title} style={{ width: '100%', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                   <p style={{ margin: 0, fontSize: '0.8rem', color: 'white' }}>{img.title}</p>
                </div>
             </motion.div>
           ))}
        </Masonry>
      </main>

      <footer style={{ marginTop: '10rem', textAlign: 'center', padding: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#222', fontSize: '0.65rem', fontFamily: 'var(--pixel-font)' }}>
         BATCH_DISTRIBUTION_PROTOCOL // ENCRYPTION_STRENGTH: 256_BIT // BY_SNAP_SHARE
      </footer>
    </div>
  );
};

export default GalleryPage;

