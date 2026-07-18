import React, { useRef, useState, useEffect } from 'react';

interface SignaturePadProps {
  onSign: (base64Image: string) => void;
  onClear: () => void;
}

export default function SignaturePad({ onSign, onClear }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#2C2C2C';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      setHasSignature(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasSignature(false);
    onClear();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      const dataUrl = canvas.toDataURL('image/png');
      onSign(dataUrl);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ 
        border: '2px dashed #E0E0E0', 
        borderRadius: '8px', 
        overflow: 'hidden',
        backgroundColor: '#FAF9F7'
      }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          style={{ cursor: 'crosshair', touchAction: 'none' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={handleClear}
          style={{
            padding: '8px 16px',
            border: '1px solid #E0E0E0',
            borderRadius: '6px',
            background: 'white',
            color: '#666',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          Effacer
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasSignature}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            background: hasSignature ? '#DD7246' : '#E0E0E0',
            color: 'white',
            cursor: hasSignature ? 'pointer' : 'not-allowed',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          Confirmer la signature
        </button>
      </div>
    </div>
  );
}
