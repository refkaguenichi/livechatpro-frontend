'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/components/WithAuth';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { FaGoogle } from 'react-icons/fa';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { loginUser } = useAuth();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
    const res= await api.post('/user/register', { name, email, password });
    loginUser(res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleRegister} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-primary">Register</h2>
        <div className="flex flex-col gap-1 mb-1">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1 mb-1">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your Email"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1 mb-1">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your Password"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="w-full flex flex-col items-center gap-3 mt-4">
          <button type="submit" className="w-full btn btn-primary">Register</button>
          <a href="http://localhost:1000/auth/google" className='w-full hover:!no-underline !no-underline'>
          <button
            type="button"
            className="w-full btn btn-secondary flex items-center justify-center gap-2"
          >
            <FaGoogle className="text-lg" />
            <span>Register with Google</span>
          </button>
          </a>
        </div>
        <div className="mt-4 text-center">
          <span>Already have an account?</span>{' '}
          <Link href="/login" className="text-gray-500 font-semibold hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default withAuth(RegisterPage, false);