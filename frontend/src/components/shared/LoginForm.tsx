import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../../schemas/auth.schema';
import {
  FormInput,
  PasswordField,
  CustomCheckbox,
  SubmitButton,
} from './AuthUI';
import { darlinkApi } from '../../services/darlinkApi';
import { toast } from 'sonner';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await darlinkApi.login(data.email, data.password);
      toast.success('Connexion réussie. Redirection…');
      setTimeout(() => {
        if (response.user.role === 'ADMIN') window.location.href = '/admin';
        else if (response.user.role === 'HOTE') window.location.href = '/host';
        else window.location.href = '/';
      }, 800);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Connexion impossible');
    }
  };

  return (
    <>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '6px', letterSpacing: '-0.4px' }}>
        Bon retour
      </h2>
      <p style={{ fontSize: '0.88rem', color: '#9CA3AF', marginBottom: '28px' }}>
        Veuillez entrer vos identifiants pour vous connecter à votre compte.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormInput
                icon={<Mail size={16} />}
                label="Adresse e-mail"
                type="email"
                placeholder="Entrez votre adresse e-mail"
                {...field}
              />
            )}
          />
          {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Mot de passe
            </label>
            <button
              type="button"
              style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: '#DD7246', fontWeight: 600, cursor: 'pointer' }}
            >
              Mot de passe oublié ?
            </button>
          </div>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordField
                show={showPassword}
                onToggle={() => setShowPassword(v => !v)}
                {...field}
              />
            )}
          />
          {errors.password && <span className="text-red-500 text-xs block">{errors.password.message}</span>}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#6B7280' }}>
          <CustomCheckbox checked={remember} onChange={() => setRemember(v => !v)} />
          Se souvenir de moi
        </label>

        <SubmitButton submitting={isSubmitting} label="Se connecter" />

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#9CA3AF', margin: '4px 0 0' }}>
          Vous n'avez pas de compte ?{' '}
          <span
            onClick={onSwitchToSignup}
            style={{ color: '#DD7246', cursor: 'pointer', fontWeight: 700 }}
          >
            Inscrivez-vous maintenant
          </span>
        </p>
      </form>
    </>
  );
};

export default LoginForm;