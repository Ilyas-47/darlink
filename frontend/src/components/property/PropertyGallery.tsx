import React, { useState } from 'react';
import { Grid2X2, X } from 'lucide-react';

interface PropertyGalleryProps {
  images: { url: string }[];
  title: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const imgs = images.length > 0
    ? images
    : [
        { url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2071' },
        { url: 'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?q=80&w=2070' },
        { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?q=80&w=2070' },
        { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070' },
      ];

  const openLightbox = (idx: number) => { setLightboxIdx(idx); setLightboxOpen(true); };

  return (
    <>
      {/* Bento Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gridTemplateRows: '240px 240px',
          gap: '8px',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '32px',
          position: 'relative',
        }}
      >
        {/* Main large image */}
        <div
          onClick={() => openLightbox(0)}
          style={{ gridRow: '1 / 3', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
        >
          <img
            src={imgs[0]?.url}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', display: 'block' }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>

        {/* Top-right */}
        <div onClick={() => openLightbox(1)} style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>
          <img
            src={imgs[1]?.url || imgs[0]?.url}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', display: 'block' }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>

        {/* Bottom-right */}
        <div onClick={() => openLightbox(2)} style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>
          <img
            src={imgs[2]?.url || imgs[0]?.url}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', display: 'block' }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
          {/* "Show all photos" button */}
          <button
            onClick={e => { e.stopPropagation(); setLightboxOpen(true); setLightboxIdx(0); }}
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#1A1A2E',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            }}
          >
            <Grid2X2 size={14} />
            {imgs.length} photos
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.92)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>

          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '100%' }}>
            <img
              src={imgs[lightboxIdx]?.url}
              alt=""
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '12px', display: 'block', margin: '0 auto' }}
            />
            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {imgs.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxIdx(i)}
                  style={{
                    width: '64px',
                    height: '48px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: `2px solid ${lightboxIdx === i ? '#DD7246' : 'transparent'}`,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyGallery;