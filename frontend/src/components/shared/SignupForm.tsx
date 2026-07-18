import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../../schemas/auth.schema';
import {
  FormInput,
  PasswordField,
  PasswordStrengthBar,
  CustomCheckbox,
  SubmitButton,
} from './AuthUI';
import { darlinkApi } from '../../services/darlinkApi';
import { toast } from 'sonner';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'CLIENT',
      acceptTerms: false
    }
  });

  const passwordValue = watch('password');
  const roleValue = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await darlinkApi.register({
        nom: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        motDePasse: data.password,
        role: data.role,
        profession: data.role === 'CLIENT' ? 'Membre' : undefined,
      });
      toast.success('Compte créé. Redirection…');
      setTimeout(() => { window.location.href = data.role === 'HOTE' ? '/host-register' : '/'; }, 900);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Inscription impossible');
    }
  };

  return (
    <>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '6px', letterSpacing: '-0.4px' }}>
        Create your account
      </h2>
      <p style={{ fontSize: '0.88rem', color: '#9CA3AF', marginBottom: '28px' }}>
        Already have an account?{' '}
        <span onClick={onSwitchToLogin} style={{ color: '#DD7246', cursor: 'pointer', fontWeight: 600 }}>
          Log in
        </span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <FormInput label="First Name" placeholder="your first name" {...field} />
              )}
            />
            {errors.firstName && <span className="text-red-500 text-xs mt-1 block">{errors.firstName.message}</span>}
          </div>
          <div>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <FormInput label="Last Name" placeholder="your last name" {...field} />
              )}
            />
            {errors.lastName && <span className="text-red-500 text-xs mt-1 block">{errors.lastName.message}</span>}
          </div>
        </div>

        <div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormInput icon={<Mail size={16} />} label="Email Address" type="email" placeholder="enter your email" {...field} />
            )}
          />
          {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Account Type
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {(['CLIENT', 'HOTE'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setValue('role', r)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: `2px solid ${roleValue === r ? '#DD7246' : '#E5E7EB'}`,
                  backgroundColor: roleValue === r ? '#FFFAF7' : 'white',
                  color: roleValue === r ? '#DD7246' : '#6B7280',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {r === 'CLIENT' ? 'Voyageur' : 'Hôte'}
              </button>
            ))}
          </div>
          {errors.role && <span className="text-red-500 text-xs block">{errors.role.message}</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Password
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordField show={showPassword} onToggle={() => setShowPassword(v => !v)} {...field} />
            )}
          />
          <PasswordStrengthBar password={passwordValue} />
          {errors.password && <span className="text-red-500 text-xs block">{errors.password.message}</span>}
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.5 }}>
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field }) => (
                <CustomCheckbox checked={field.value} onChange={() => field.onChange(!field.value)} />
              )}
            />
            <span>
              I agree to Darlink's{' '}
              <a href="#" style={{ color: '#DD7246', fontWeight: 600 }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: '#DD7246', fontWeight: 600 }}>Privacy Policy</a>.
            </span>
          </label>
          {errors.acceptTerms && <span className="text-red-500 text-xs mt-1 block">{errors.acceptTerms.message}</span>}
        </div>

        <SubmitButton submitting={isSubmitting} label="Create Account" />

        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#9CA3AF', margin: '4px 0 0' }}>
          Need assistance?{' '}
          <a href="#" style={{ color: '#DD7246', fontWeight: 600 }}>Contact Support</a>
        </p>
      </form>
    </>
  );
};

export default SignupForm;