import { useState, useEffect } from 'react';
import { Sparkles, Download, RefreshCw, Image, Wand2, ChevronDown } from 'lucide-react';
import { API_BASE, authHeaders } from '../../config/api';

interface Template {
  label: string;
  prompt: string;
}

interface AIImageGeneratorProps {
  onImageGenerated?: (url: string) => void;
}

export default function AIImageGenerator({ onImageGenerated }: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>('16:9');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/ai/templates`)
      .then(res => res.json())
      .then(setTemplates)
      .catch(console.error);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError('');
    setGeneratedImage(null);

    try {
      const res = await fetch(`${API_BASE}/ai/generate-image`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ prompt, aspectRatio }),
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        onImageGenerated?.(data.imageUrl);
      } else {
        setError(data.error || 'Erreur lors de la génération');
      }
    } catch {
      setError('Erreur de connexion au serveur');
    } finally {
      setGenerating(false);
    }
  };

  const selectTemplate = (t: Template) => {
    setPrompt(t.prompt);
    setShowTemplates(false);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1A1007 0%, #2D1F10 100%)',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(221,114,70,0.2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-50%', right: '-30%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(221,114,70,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #DD7246, #E8956A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Higgsfield AI
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: 0 }}>
              Générateur d'images pour votre espace
            </p>
          </div>
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(221,114,70,0.15)',
            color: '#DD7246',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '100px',
            letterSpacing: '0.05em',
          }}>
            POWERED BY AI
          </span>
        </div>
      </div>

      {/* Templates dropdown */}
      <div style={{ position: 'relative', zIndex: 10, marginBottom: '12px' }}>
        <button
          onClick={() => setShowTemplates(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px', padding: '10px 14px',
            color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(221,114,70,0.4)'}
          onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wand2 size={14} /> Choisir un template
          </span>
          <ChevronDown size={14} style={{ transform: showTemplates ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {showTemplates && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: '#1E150C', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px', overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            maxHeight: '200px', overflowY: 'auto',
          }}>
            {templates.map((t, i) => (
              <button
                key={i}
                onClick={() => selectTemplate(t)}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 14px',
                  background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.75)', fontSize: '0.83rem', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(221,114,70,0.1)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontWeight: 600, color: '#DD7246' }}>{t.label}</span>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px', lineHeight: 1.4 }}>
                  {t.prompt.slice(0, 80)}...
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Prompt input */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '12px' }}>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Décrivez l'espace que vous souhaitez générer... Ex: Un salon moderne avec des touches marocaines, des plantes vertes et une lumière chaleureuse"
          rows={3}
          style={{
            width: '100%', resize: 'none',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '14px',
            color: 'white', fontSize: '0.88rem', lineHeight: 1.6,
            outline: 'none', fontFamily: 'Inter, sans-serif',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(221,114,70,0.5)'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
        {/* Aspect ratio */}
        <select
          value={aspectRatio}
          onChange={e => setAspectRatio(e.target.value as any)}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '8px 12px',
            color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem',
            outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="16:9">16:9 Paysage</option>
          <option value="9:16">9:16 Portrait</option>
          <option value="1:1">1:1 Carré</option>
          <option value="4:3">4:3 Standard</option>
        </select>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: generating
              ? 'linear-gradient(135deg, #8B5A3A, #6B4428)'
              : 'linear-gradient(135deg, #DD7246, #E8956A)',
            border: 'none', borderRadius: '10px', padding: '12px 20px',
            color: 'white', fontSize: '0.9rem', fontWeight: 700,
            cursor: generating || !prompt.trim() ? 'not-allowed' : 'pointer',
            opacity: !prompt.trim() ? 0.5 : 1,
            transition: 'all 0.3s',
            boxShadow: generating ? 'none' : '0 4px 20px rgba(221,114,70,0.3)',
          }}
        >
          {generating ? (
            <>
              <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Générer avec l'IA
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
          color: '#FCA5A5', fontSize: '0.83rem', position: 'relative', zIndex: 1,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Generated image preview */}
      {generatedImage && (
        <div style={{
          borderRadius: '14px', overflow: 'hidden',
          border: '1px solid rgba(221,114,70,0.3)',
          position: 'relative', zIndex: 1,
        }}>
          <img
            src={generatedImage}
            alt="Generated coliving space"
            style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            display: 'flex', gap: '8px', padding: '12px',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
          }}>
            <button
              onClick={() => onImageGenerated?.(generatedImage)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: '#DD7246', border: 'none', borderRadius: '8px',
                padding: '8px', color: 'white', fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Image size={14} /> Utiliser cette image
            </button>
            <a
              href={generatedImage}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px', padding: '8px 12px', color: 'white',
                textDecoration: 'none', cursor: 'pointer',
              }}
            >
              <Download size={14} />
            </a>
            <button
              onClick={handleGenerate}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px', padding: '8px 12px', color: 'white',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
