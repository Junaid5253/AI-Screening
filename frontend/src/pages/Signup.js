import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // optional: auto redirect to login
        navigate('/login');
      } else {
        setError('Signup failed');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      {/* HEADER */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Join HireSense AI Screening System
        </p>
      </div>

      {/* FORM CARD */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-slate-100">

          <form className="space-y-6" onSubmit={handleSignup}>

            {/* NAME */}
            <div>
              <label className="block text-sm font-bold text-slate-700">
                Full Name
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  required
                  className="w-full px-10 py-3 border rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-bold text-slate-700">
                Email
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  required
                  className="w-full px-10 py-3 border rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-bold text-slate-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type="password"
                  required
                  className="w-full px-10 py-3 border rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
              <ArrowRight size={18} />
            </button>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600 text-center font-medium">
                {error}
              </p>
            )}

          </form>

          {/* LOGIN LINK */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-indigo-600 font-bold cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}