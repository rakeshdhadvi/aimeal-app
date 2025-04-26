"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/supabase-js';
import Script from 'next/script';
import { Dashboard } from '@/components/dashboard';

export default function Page() {
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const createUserIfNotExists = async (user: any) => {
    if (!user) return;
  
    console.log("Trying to create user:", user); // ADD THIS
  
    const { data, error } = await supabase
      .from('users')
      .upsert([
        {
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name || null,
          avatar_url: user.user_metadata.avatar_url || null,
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: ['id'] });
  
    if (error) {
      console.error("Error creating user:", error.message);
    } else {
      console.log("User inserted or already exists:", data);
    }
  };
  

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else {
        setSession(data.session);
      }
      setLoading(false);
    };
  
    getSession();
  
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
  
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  
  
  
  

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  
    if (error) {
      console.error("Google sign in error:", error.message);
    } else if (data?.user) {
      await createUserIfNotExists(data.user);
    }
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-sky-100 to-indigo-200 p-4">
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">Sign in to Aimeal</h2>
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send Magic Link
            </button>
          </form>
          <div className="text-center text-gray-500">or</div>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
          >
            Sign In with Google
          </button>
          {message && <p className="text-sm text-center text-gray-600">{message}</p>}
        </div>
      </main>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <Dashboard />
    </>
  );
}
