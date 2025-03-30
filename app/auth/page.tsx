'use client';

import { useState } from 'react';
import { Bot } from 'lucide-react';
import { LoginForm } from '@/modules/auth/components/login-form';
import { RegisterForm } from '@/modules/auth/components/register-form';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-blue-600/10 p-3 rounded-full">
              <Bot className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-gray-400 mt-2">
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Fill in your details to get started'}
            </p>
          </div>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:text-blue-400 text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
