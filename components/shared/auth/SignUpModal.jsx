'use client';
import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, X } from 'lucide-react';
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const SignUpModal = ({ darkMode, onClose, onSwitchToSignIn }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Location Info
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    state: '',
    city: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.country || !formData.state || !formData.city) {
      setError('Please fill in all location details');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSignUp = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    const result = await signUpWithEmail(formData.email, formData.password, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      country: formData.country,
      state: formData.state,
      city: formData.city
    });

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

        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className={`mb-6 ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
          Step {step} of 2: {step === 1 ? 'Basic Information' : 'Location Details'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500 text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
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
              <span>Sign up with Google</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? 'border-amber-700' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>Or sign up with email</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-slate-800 border-amber-700 text-amber-100' 
                          : 'bg-white border-gray-300 text-slate-900'
                      }`}
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-slate-800 border-amber-700 text-amber-100' 
                          : 'bg-white border-gray-300 text-slate-900'
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                <label className="block mb-2 text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-slate-800 border-amber-700 text-amber-100' 
                        : 'bg-white border-gray-300 text-slate-900'
                    }`}
                    placeholder="+1 234 567 8900"
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
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-slate-800 border-amber-700 text-amber-100' 
                        : 'bg-white border-gray-300 text-slate-900'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                onClick={handleNext}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold hover:shadow-xl transition-all"
              >
                Next: Location Details
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Country</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-800 border-amber-700 text-amber-100' 
                      : 'bg-white border-gray-300 text-slate-900'
                  }`}
                  placeholder="India"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">State</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-800 border-amber-700 text-amber-100' 
                      : 'bg-white border-gray-300 text-slate-900'
                  }`}
                  placeholder="Gujarat"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-800 border-amber-700 text-amber-100' 
                      : 'bg-white border-gray-300 text-slate-900'
                  }`}
                  placeholder="Ahmedabad"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  darkMode
                    ? 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                    : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                }`}
              >
                Back
              </button>
              <button
                onClick={handleSignUp}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold hover:shadow-xl transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </div>
        )}

        <p className="text-center mt-6 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToSignIn}
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpModal;