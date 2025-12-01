import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import AuthLayout from './AuthLayout';
import Checkbox from '../ui/Checkbox';
import * as Icons from '../ui/Icons';

const getFirebaseAuthErrorMessage = (error) => {
    if (error.code) {
        switch (error.code) {
            case 'auth/email-already-in-use' 'An account with this email already exists.';
            case 'auth/weak-password' 'Password is too weak. It should be at least 6 characters.';
            case 'auth/invalid-email' 'Please enter a valid email address.';
            default 'An unexpected error occurred. Please try again.';
        }
    }
    return error.message || 'An unexpected error occurred.';
};

const SignupPage.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    
    setIsLoading(true);
    try {
        await signup({ fullName, email, password });
        navigate('/select-device');
    } catch (err) {
        setError(getFirebaseAuthErrorMessage(err));
    }
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <AuthLayout activeTab="signup">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          id="fullName"
          label="Full Name"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password"
          label="Password"
          type={passwordVisible ? 'text' : 'password'}
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endIcon={
            <button type="button" onClick={togglePasswordVisibility} className="text-gray-400 hover-gray-600 dark-gray-200">
              {passwordVisible ? (
                <Icons.EyeSlashIcon className="h-5 w-5" />
              ) : (
                <Icons.EyeIcon className="h-5 w-5" />
              )}
            </button>
          }
        />
         <Checkbox 
            id="terms" 
            label={<>I agree to the <a href="#" className="text-primary hover">Terms</a> and <a href="#" className="text-primary hover">Privacy Policy</a>.</>} 
            required 
        />
        {error && <p className="text-error text-sm text-center">{error}</p>}
        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;