'use client';
import React, { useState } from 'react';
import { Mail, Lock, X } from 'lucide-react';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const SignInModal = ({ darkMode, onClose, onSwitchToSignUp }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const result = await signInWithEmail(formData.email, formData.password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`max-w-md w-full rounded-2xl p-8 relative ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-900 to-amber-950 border border-amber-700/30' 
          : 'bg-white shadow-2xl'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className={`mb-6 ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
          Sign in to continue your spiritual journey
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full py-3 rounded-lg mb-4 font-semibold transition-all flex items-center justify-center space-x-2 ${
            darkMode 
              ? 'bg-white text-slate-900 hover:bg-gray-100' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${darkMode ? 'border-amber-700' : 'border-gray-300'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>Or continue with email</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-slate-800 border-amber-700 text-amber-100' 
                    : 'bg-white border-gray-300 text-slate-900'
                }`}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-slate-800 border-amber-700 text-amber-100' 
                    : 'bg-white border-gray-300 text-slate-900'
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className={`w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold hover:shadow-xl transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>

        <p className="text-center mt-6 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignUp}
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInModal;