import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, ArrowLeft, Download, ShieldCheck, Zap, Maximize2, MoreHorizontal, ExternalLink } from 'lucide-react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import RippleButton from '../components/RippleButton';
import PixelLoader from '../components/PixelLoader';

const GalleryPage = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProtected, setIsProtected] = useState(false);
  const [passKey, setPassKey] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

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

  const handleDownload = (imageUrl, title) => {
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    window.location.href = `http://localhost:5000/api/proxy-download?url=${encodeURIComponent(imageUrl)}&filename=${filename}`;
  };

  const handleShare = (imageUrl) => {
    if (navigator.share) {
      navigator.share({
        title: 'SnapShare Image',
        url: imageUrl
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(imageUrl);
      alert('LINK_COPIED_TO_CLIPBOARD');
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
             <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }} 
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ marginBottom: '2rem', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}
             >
                <img src={img.url} alt={img.title} style={{ width: '100%', display: 'block', transition: '0.5s transform cubic-bezier(0.4, 0, 0.2, 1)', transform: hoveredIdx === i ? 'scale(1.05)' : 'scale(1)' }} />
                
                <AnimatePresence>
                   {hoveredIdx === i && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}
                     >
                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                               <p style={{ margin: 0, fontSize: '0.8rem', color: 'white', fontWeight: 'bold', marginBottom: '0.2rem' }}>{img.title || 'UNTITLED'}</p>
                               <p style={{ margin: 0, fontSize: '0.6rem', color: 'var(--neon-cyan)', fontFamily: 'var(--pixel-font)' }}>UNIT_SYNCED</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                               <button 
                                  onClick={(e) => { e.stopPropagation(); handleDownload(img.url, img.title); }}
                                  style={{ background: 'rgba(0, 243, 255, 0.2)', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: '0.3s' }}
                               >
                                  <Download size={18} />
                               </button>
                               <button 
                                  onClick={(e) => { e.stopPropagation(); handleShare(img.url); }}
                                  style={{ background: 'rgba(157, 0, 255, 0.2)', border: '1px solid var(--neon-purple)', color: 'var(--neon-purple)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: '0.3s' }}
                               >
                                  <Share2 size={18} />
                               </button>
                            </div>
                        </motion.div>
                     </motion.div>
                   )}
                </AnimatePresence>
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
