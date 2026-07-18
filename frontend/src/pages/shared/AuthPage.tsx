import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLeftPanel from '../../components/shared/AuthLeftPanel';
import LoginForm from '../../components/shared/LoginForm';
import SignupForm from '../../components/shared/SignupForm';

type AuthMode = 'login' | 'signup';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF9F7' }}>

      {/* ── LEFT: image + text panel ── */}
      <AuthLeftPanel mode={mode} />

      {/* ── RIGHT: form panel ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(32px, 5vw, 64px)',
          overflowY: 'auto',
        }}
      >
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>

          {/* Darlink Logo */}
          <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
            <img
              src="/logo.png"
              alt="Darlink Logo"
              style={{
                height: '80px',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Mode tabs */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#F5F3F0',
              borderRadius: '16px',
              padding: '6px',
              marginBottom: '40px',
              gap: '6px',
            }}
          >
            {(['login', 'signup'] as AuthMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: mode === m ? 'white' : 'transparent',
                  color: mode === m ? '#1A1A2E' : '#9CA3AF',
                  fontWeight: mode === m ? 800 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: mode === m ? '0 8px 16px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          {/* Active form with smooth transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {mode === 'login'
                ? <LoginForm onSwitchToSignup={() => setMode('signup')} />
                : <SignupForm onSwitchToLogin={() => setMode('login')} />
              }
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[data-panel="left"] { display: none !important; }
        }
        input::placeholder { color: #C4C4C4; }
      `}</style>
    </div>
  );
};

export default AuthPage;