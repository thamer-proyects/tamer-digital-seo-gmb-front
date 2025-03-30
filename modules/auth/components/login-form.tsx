import { AuthDivider } from './auth-divider';
import { SocialButton } from './social-button';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { LoginFormData } from '../schema/signIn';
import RootInput from '@/components/ui/root-input';
import { Button } from '@heroui/react';

export function LoginForm() {
  const methods = useForm<LoginFormData>();

  const handleGoogleLogin = () => {
    // Implement Google login
  };

  const onSubmit: SubmitHandler<LoginFormData> = (data: LoginFormData) => {
    console.log(data);
    // Aquí puedes manejar la lógica de inicio de sesión
  };

  return (
    <div className="space-y-6">
      <SocialButton label="Continue with Google" onClick={handleGoogleLogin} />
      <AuthDivider />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <RootInput
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            required
          />

          <RootInput
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            required
          />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
            Sign in
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
