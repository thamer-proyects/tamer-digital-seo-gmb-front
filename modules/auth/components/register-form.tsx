import { AuthDivider } from './auth-divider';
import { SocialButton } from './social-button';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { RegisterFormData } from '../schema/signUp';
import RootInput from '@/components/ui/root-input';
import { Button } from '@heroui/react';

export function RegisterForm() {
  const methods = useForm<RegisterFormData>();

  const handleGoogleSignup = () => {
    // Implement Google signup
  };

  const onSubmit: SubmitHandler<RegisterFormData> = (data: RegisterFormData) => {
    console.log(data);
    // Aquí puedes manejar la lógica de registro
  };

  return (
    <div className="space-y-6">
      <SocialButton label="Sign up with Google" onClick={handleGoogleSignup} />
      <AuthDivider />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <RootInput
              label="First name"
              name="firstName"
              placeholder="John"
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              required
            />

            <RootInput
              label="Last name"
              name="lastName"
              placeholder="Doe"
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              required
            />
          </div>

          <RootInput
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            required
          />

          <RootInput
            label="Phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
          />

          <RootInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            required
          />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
            Create account
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
