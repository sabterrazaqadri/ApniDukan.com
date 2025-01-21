/* eslint-disable @typescript-eslint/no-unused-vars */


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check if account is locked
    const storedLockoutUntil = localStorage.getItem('adminLockoutUntil');
    if (storedLockoutUntil) {
      const lockoutTime = parseInt(storedLockoutUntil);
      if (lockoutTime > Date.now()) {
        const minutesLeft = Math.ceil((lockoutTime - Date.now()) / (60 * 1000));
        setError(`Account is locked. Please try again in ${minutesLeft} minutes.`);
        return;
      } else {
        localStorage.removeItem('adminLockoutUntil');
        localStorage.removeItem('adminLoginAttempts');
      }
    }

    // Validate credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.removeItem('adminLoginAttempts');
      localStorage.removeItem('adminLockoutUntil');
      router.replace('/admin');
    } else {
      const attempts = (parseInt(localStorage.getItem('adminLoginAttempts') || '0') + 1);
      localStorage.setItem('adminLoginAttempts', attempts.toString());
      setLoginAttempts(attempts);

      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_TIME;
        setLockoutUntil(lockoutTime);
        localStorage.setItem('adminLockoutUntil', lockoutTime.toString());
        setError(`Too many failed attempts. Account is locked for 15 minutes.`);
      } else {
        setError(`Invalid credentials. ${MAX_LOGIN_ATTEMPTS - attempts} attempts remaining.`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your credentials to access the admin panel
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!!lockoutUntil && lockoutUntil > Date.now()}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!!lockoutUntil && lockoutUntil > Date.now()}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!!lockoutUntil && lockoutUntil > Date.now()}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
