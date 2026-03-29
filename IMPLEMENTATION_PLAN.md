# SnapShare Implementation Plan

SnapShare is a futuristic, pixel-inspired image sharing platform designed with high-end aesthetics and smooth performance.

## 🎨 Design Philosophy
The UI follows a **"Retro-Futuristic"** aesthetic:
- **Pixel Foundations**: All headings and logo elements use pixel-style typography (`Silkscreen`, `Press Start 2P`).
- **Modern Glassmorphism**: Cards and navigation use `backdrop-filter: blur(12px)` and semi-transparent backgrounds for a premium SaaS look.
- **Neon Accents**: A color palette centered around Cyan (`#00f3ff`), Purple (`#9d00ff`), and Pink (`#ff00ff`) on a charcoal/black background (`#050505`).

## 🏗️ Technical Stack
- **Frontend**: React (Vite-powered)
- **Styling**: Vanilla CSS with CSS Variables for theme management.
- **Animations**: Framer Motion for page transitions, scale-on-scroll, and button ripple effects.
- **Backend**: Node.js with Express.
- **Database**: MongoDB (via Mongoose) for storing image metadata.
- **Image Storage**: Cloudinary (configuration template provided).

## 🚀 Key Features
1. **Pixel Header System**: Each section has a pixel-style header with neon gradients.
2. **Glass-Card Grid**: Smooth fade-in and spring-based animations for an organic feel.
3. **Ripple Interactions**: Custom React hook (`useRipple`) for high-fidelity button feedback.
4. **Animated Upload Modal**: A glass-blur modal for intuitive data ingestion.

## 📲 Navigation
Mobile-first responsive design using modern CSS Flex and Grid layouts. Sticky navbar with glass blur ensures clarity at all scroll heights.

## ✅ Next Steps
- [x] Initialize Project Structure
- [x] Design Core CSS Design System
- [x] Build Animated React Components
- [x] Setup Node/Express Backend
- [ ] Connect Real Cloudinary Account (User Task)
- [ ] Deploy to Production (Vercel/Render)
