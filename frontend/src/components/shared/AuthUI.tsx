import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

/* ── FormInput ─────────────────────────────── */
interface FormInputProps {
  icon?: React.ReactNode;
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  extra?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  icon, label, type = 'text', name, value, onChange, placeholder, extra,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </label>
        {extra}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '11px 14px',
          border: `1.5px solid ${focused ? '#DD7246' : '#E5E7EB'}`,
          borderRadius: '10px',
          backgroundColor: focused ? '#FFFAF7' : 'white',
          transition: 'all 0.2s',
        }}
      >
        {icon && <span style={{ color: focused ? '#DD7246' : '#9CA3AF', display: 'flex' }}>{icon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.9rem',
            color: '#1A1A2E',
            backgroundColor: 'transparent',
            fontWeight: 500,
          }}
        />
      </div>
    </div>
  );
};

/* ── PasswordField ──────────────────────────── */
interface PasswordFieldProps {
  value: string;
  name: string;
  show: boolean;
  onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ value, name, show, onToggle, onChange }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '11px 14px',
        border: `1.5px solid ${focused ? '#DD7246' : '#E5E7EB'}`,
        borderRadius: '10px',
        backgroundColor: focused ? '#FFFAF7' : 'white',
        transition: 'all 0.2s',
      }}
    >
      <Lock size={16} color={focused ? '#DD7246' : '#9CA3AF'} style={{ marginRight: '10px', flexShrink: 0 }} />
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          fontSize: '0.9rem',
          color: '#1A1A2E',
          backgroundColor: 'transparent',
          fontWeight: 500,
        }}
      />
      <button
        type="button"
        onClick={onToggle}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: '0 2px' }}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

/* ── PasswordStrengthBar ────────────────────── */
interface PasswordStrengthBarProps {
  password: string;
}

export const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password }) => {
  const getStrength = (p: string) => {
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = getStrength(password);
  const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E'];

  if (!password) return null;

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '3px',
              borderRadius: '2px',
              backgroundColor: i < strength ? colors[strength - 1] : '#E5E7EB',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: '0.72rem', color: colors[strength - 1] || '#9CA3AF', margin: 0 }}>
        Must be at least 6 characters long with a mix of letters and numbers.
      </p>
    </div>
  );
};

/* ── CustomCheckbox ─────────────────────────── */
interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: '17px',
      height: '17px',
      minWidth: '17px',
      borderRadius: '5px',
      border: `2px solid ${checked ? '#DD7246' : '#D1D5DB'}`,
      backgroundColor: checked ? '#DD7246' : 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.15s',
      marginTop: '2px',
    }}
  >
    {checked && (
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
        <path d="M1 3.5L3.2 5.5L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </div>
);

/* ── Divider ────────────────────────────────── */
interface DividerProps {
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({ label = 'OR CONTINUE WITH' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
      {label}
    </span>
    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
  </div>
);

/* ── SubmitButton ───────────────────────────── */
interface SubmitButtonProps {
  submitting: boolean;
  label: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ submitting, label }) => (
  <button
    type="submit"
    disabled={submitting}
    style={{
      width: '100%',
      padding: '13px',
      backgroundColor: submitting ? '#F0A882' : '#DD7246',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '0.95rem',
      fontWeight: 700,
      cursor: submitting ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background 0.2s',
      marginTop: '4px',
    }}
    onMouseOver={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#C4622F'; }}
    onMouseOut={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#DD7246'; }}
  >
    {submitting ? (
      <>
        <span style={{
          width: '16px', height: '16px', borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white',
          animation: 'spin 0.8s linear infinite', display: 'inline-block',
        }} />
        Chargement…
      </>
    ) : (
      <>{label} <ArrowRight size={16} /></>
    )}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </button>
);

/* ── SocialButton ───────────────────────────── */
interface SocialButtonProps {
  icon: string;
  label: string;
  dark?: boolean;
  onClick?: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, dark = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '11px 16px',
      borderRadius: '10px',
      border: dark ? 'none' : '1.5px solid #E5E7EB',
      backgroundColor: dark ? '#1A1A2E' : 'white',
      color: dark ? 'white' : '#374151',
      fontSize: '0.85rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
    onMouseOver={e => {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}
    onMouseOut={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <span style={{ fontSize: '1rem' }}>{icon}</span>
    {label}
  </button>
);

/* ── AlertMessage ───────────────────────────── */
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface AlertMessageProps {
  type: 'error' | 'success';
  message: string;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
  const isError = type === 'error';
  return (
    <div
      style={{
        backgroundColor: isError ? '#FEF2F2' : '#F0FDF4',
        border: `1px solid ${isError ? '#FECACA' : '#BBF7D0'}`,
        borderRadius: '10px',
        padding: '12px 14px',
        fontSize: '0.85rem',
        color: isError ? '#DC2626' : '#16A34A',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {isError ? <AlertTriangle size={18} /> : <CheckCircle size={18} />} {message}
    </div>
  );
};