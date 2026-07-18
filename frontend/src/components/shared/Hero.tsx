import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [duration, setDuration] = useState('1 mois');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (checkIn) params.set('date', checkIn);
    if (duration) params.set('duration', duration);
    navigate(`/destinations?${params.toString()}`);
  };

  // ── 3D Interactive Canvas Particle Engine ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      z: number;
      ox: number;
      oy: number;
      oz: number;
      size: number;
      color: string;
    }> = [];

    const particleCount = Math.min(100, Math.floor((width * height) / 12000));

    // Generate random 3D points
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 400 + 100,
        ox: 0,
        oy: 0,
        oz: 0,
        size: Math.random() * 2 + 1,
        color: i % 3 === 0 ? '221, 114, 70' : i % 3 === 1 ? '79, 70, 229' : '255, 255, 255'
      });
      // Store original coords
      particles[i].ox = particles[i].x;
      particles[i].oy = particles[i].y;
      particles[i].oz = particles[i].z;
    }

    const mouse = mouseRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left - width / 2;
      mouse.y = e.clientY - rect.top - height / 2;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);

    // Camera settings
    const fov = 350;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle moving lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      
      // Update & project particles
      particles.forEach((p) => {
        // Slow float
        p.ox += Math.sin(Date.now() * 0.0005 + p.z) * 0.1;
        p.oy += Math.cos(Date.now() * 0.0003 + p.z) * 0.1;

        // Interaction with mouse (push / pull in 3D space)
        if (mouse.active) {
          const dx = mouse.x - p.ox;
          const dy = mouse.y - p.oy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            const force = (300 - dist) / 300;
            p.x = p.ox - (dx / dist) * force * 40;
            p.y = p.oy - (dy / dist) * force * 40;
          } else {
            p.x += (p.ox - p.x) * 0.05;
            p.y += (p.oy - p.y) * 0.05;
          }
        } else {
          p.x += (p.ox - p.x) * 0.05;
          p.y += (p.oy - p.y) * 0.05;
        }

        // Project 3D coordinate to 2D screen coordinate
        const scale = fov / (fov + p.z);
        const sx = p.x * scale + width / 2;
        const sy = p.y * scale + height / 2;

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          const size = p.size * scale * 2;
          const alpha = (1 - p.z / 500) * 0.4;
          
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
          ctx.fill();

          // Connect close particles (3D constellation effect)
          particles.forEach((other) => {
            if (p === other) return;
            const oScale = fov / (fov + other.z);
            const osx = other.x * oScale + width / 2;
            const osy = other.y * oScale + height / 2;

            const dist2D = Math.sqrt((sx - osx) ** 2 + (sy - osy) ** 2);
            if (dist2D < 120) {
              const lineAlpha = (1 - dist2D / 120) * 0.08 * Math.min(alpha, (1 - other.z / 500) * 0.4);
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(osx, osy);
              ctx.strokeStyle = `rgba(221, 114, 70, ${lineAlpha})`;
              ctx.stroke();
            }
          });
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section style={{ position: 'relative', minHeight: '98vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#0C0805' }}>
      
      {/* Dynamic Background: Video + Interactive 3D Particles */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.28 }}>
          <source src="src/assets/videos/hero_video.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,8,5,0.7) 0%, rgba(12,8,5,0.4) 50%, #FAF9F7 100%)' }} />
      </div>

      {/* 3D Interactive Canvas overlay */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }} />

      {/* Volumetric ambient glow blobs */}
      <div className="blob" style={{ background: 'radial-gradient(circle, rgba(221,114,70,0.2) 0%, transparent 70%)', top: '15%', left: '10%', width: '450px', height: '450px' }} />
      <div className="blob" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)', bottom: '15%', right: '10%', width: '400px', height: '400px', animationDelay: '3s' }} />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: '960px', width: '100%', marginTop: '-4vh' }}>
        


        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 4.8rem)', fontWeight: 800, color: 'white', lineHeight: 1.05, marginBottom: '28px', letterSpacing: '-2.5px', fontFamily: 'Outfit, Inter, sans-serif' }}>
            Ressentez l'harmonie<br />
            <span style={{ color: '#DD7246', textShadow: '0 0 40px rgba(221,114,70,0.35)' }}>du travail & de la vie</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', marginBottom: '56px', lineHeight: 1.6, maxWidth: '660px', margin: '0 auto 56px' }}
        >
          Des espaces d'exception conçus pour les nomades digitaux, créateurs et entrepreneurs. Vivez, travaillez et grandissez ensemble dans les plus beaux décors.
        </motion.p>

        {/* Search Bar (Raycast / Stripe glow border style) */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: 0.5 }}
          className="glow-card hero-search-bar"
        >
          {/* Destination */}
          <div className="hero-search-item hero-search-border">
            <MapPin size={22} color="#DD7246" />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                Destination
              </div>
              <input
                type="text"
                placeholder="Taghazout, Marrakech..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                style={{ border: 'none', outline: 'none', fontSize: '1rem', color: 'white', background: 'transparent', width: '100%', fontWeight: 600 }}
              />
            </div>
          </div>

          {/* Date */}
          <div className="hero-search-item hero-search-border" style={{ minWidth: '175px' }}>
            <Calendar size={22} color="#DD7246" />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                Arrivée
              </div>
              <input
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{ border: 'none', outline: 'none', fontSize: '0.95rem', color: checkIn ? 'white' : 'rgba(255,255,255,0.5)', background: 'transparent', width: '100%', fontWeight: 600, cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="hero-search-item">
            <Users size={22} color="#DD7246" />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                Durée
              </div>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.95rem', color: 'white', background: 'transparent', fontWeight: 600, cursor: 'pointer', width: '100%' }}
              >
                <option value="1 mois" style={{ color: '#0C0805' }}>1 mois</option>
                <option value="2 mois" style={{ color: '#0C0805' }}>2 mois</option>
                <option value="3 mois+" style={{ color: '#0C0805' }}>3 mois+</option>
              </select>
            </div>
          </div>

          {/* CTA Glow Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSearch}
            className="btn-glow magnetic"
            style={{
              padding: '18px 32px', margin: '8px', borderRadius: '16px',
              fontSize: '1rem', fontWeight: 800,
              boxShadow: '0 8px 24px rgba(221,114,70,0.3)',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <Search size={20} />
              Rechercher
            </div>
          </motion.button>
        </motion.div>

        {/* Quick tags */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1, delay: 0.8 }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '36px', flexWrap: 'wrap' }}
        >
          {['🏄 Taghazout', '🕌 Marrakech', '🌊 Essaouira', '🏙️ Casablanca'].map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(221,114,70,0.8)', borderColor: 'rgba(221,114,70,1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const city = tag.split(' ').slice(1).join(' ');
                navigate(`/destinations?location=${encodeURIComponent(city)}`);
              }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px', 
                padding: '10px 22px', fontSize: '0.9rem', fontWeight: 600, color: 'white', cursor: 'pointer'
              }}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.6, y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1.2 }}
        style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'white', fontSize: '0.8rem', fontWeight: 600, opacity: 0.5 }}
      >
        <span>Défiler</span>
        <ArrowDown size={14} />
      </motion.div>
    </section>
  );
};

export default Hero;