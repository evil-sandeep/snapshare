import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import RippleButton from '../components/RippleButton';

const GalleryPage = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/gallery/${id}`);
        setImage(response.data);
      } catch (err) {
        console.error('System Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, [id]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505' }}>
        <motion.div
          animate={{ rotate: 360, borderColor: ['#00f3ff', '#9d00ff', '#00f3ff'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          style={{ width: 50, height: 50, border: '3px solid #fff', borderRadius: '50%', borderTopWidth: '6px' }}
        />
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
    <div style={{ minHeight: '100vh', background: '#050505', padding: '2rem' }}>
      <nav style={{ maxWidth: '1200px', margin: '0 auto 4rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'var(--pixel-font)' }}>
          <ArrowLeft size={16} /> BACK_TO_FEED
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--neon-cyan)', fontSize: '0.7rem' }}>
           <ShieldCheck size={16} /> VERIFIED_ENCRYPTED_GALLERY
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card"
            style={{ padding: '1rem', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <img src={image.imageUrl} alt={image.title} style={{ width: '100%', borderRadius: '16px', display: 'block' }} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ padding: '2rem 0' }}
          >
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--neon-purple)', fontFamily: 'var(--pixel-font)', letterSpacing: '2px' }}>
                ACCESS_KEY: {image.uniqueId}
              </span>
              <h1 style={{ fontSize: '3rem', margin: '1rem 0', lineHeight: 1.1 }}>{image.title}</h1>
              <p style={{ color: '#888', fontSize: '1.2rem' }}>
                Captured by <span style={{ color: 'white', fontWeight: 'bold' }}>@{image.author}</span>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', flex: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: '#555', fontSize: '0.7rem', marginBottom: '0.5rem' }}>DATA_RATING</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                  <Heart size={20} fill="#ff00ff" stroke="#ff00ff" /> {image.likes}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', flex: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: '#555', fontSize: '0.7rem', marginBottom: '0.5rem' }}>STORAGE_OS</div>
                <div style={{ fontSize: '1.2rem', fontFamily: 'var(--pixel-font)', color: 'var(--neon-cyan)' }}>V4.2.0</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <RippleButton style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                <Share2 size={20} /> SHARE_PROTOCOL
              </RippleButton>
              <RippleButton onClick={() => window.open(image.imageUrl, '_blank')} style={{ padding: '1.2rem', background: 'none', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                <Download size={20} /> SOURCE_FETCH
              </RippleButton>
            </div>

            <div style={{ marginTop: '4rem', padding: '1.5rem', borderLeft: '2px solid var(--neon-cyan)', background: 'rgba(0, 243, 255, 0.02)' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', lineHeight: 1.6 }}>
                "This data entity is secured by SnapShare Protocol. Any unauthorized replication of light-pixels may result in temporal dissonance."
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <footer style={{ marginTop: '8rem', textAlign: 'center', color: '#333', fontSize: '0.7rem', fontFamily: 'var(--pixel-font)' }}>
         // SYSTEM_ID: {image._id} // SNAP_SHARE_ENCRYPTION_LAYER_6
      </footer>
    </div>
  );
};

export default GalleryPage;
