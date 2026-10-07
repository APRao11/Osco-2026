import React, { useState } from 'react';
import { Anchor, Sparkles, Key, Mail, ArrowRight } from 'lucide-react';

const DEMO_PASSWORD = 'coastal-crafts';

const INPUT_CLASS =
  'w-full text-xs pl-9 pr-3 py-3 rounded-lg border border-[#D8C7B2] bg-white focus:outline-none focus:ring-1 focus:ring-[#6B4632] text-[#2F2924]';

export function ArtisanLogin({
  onLogin,
  artisanName = 'Meera Nambiar',
  artisanEmail = 'meera.crafts@coastalheritage.org',
}) {
  const [email, setEmail] = useState(artisanEmail);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide your artisan email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 300);
  };

  const handleQuickDemo = () => {
    setEmail(artisanEmail);
    setPassword(DEMO_PASSWORD);
    onLogin();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#F5EBDD]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6B4632] text-white shadow-xs mb-1 border-2 border-[#D8C7B2]">
            <Anchor className="w-7 h-7 text-[#A68A64]" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-[#756A60] font-semibold block">
            Coastal Crafts Marketplace
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#6B4632]">
            Artisan Studio Login
          </h1>
          <p className="text-xs text-[#756A60] max-w-xs mx-auto">
            Sign in to manage your workshop, craft stories, and handmade catalog.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="card p-6 sm:p-8 shadow-xs border-[#D8C7B2]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="artisan-email"
                className="block text-xs font-semibold text-[#2F2924]"
              >
                Artisan Email / Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#756A60]">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="artisan-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artisan@coastalheritage.org"
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="artisan-password"
                className="block text-xs font-semibold text-[#2F2924]"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#756A60]">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  id="artisan-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-xs py-3 font-semibold shadow-xs"
              >
                {isLoading ? (
                  <span>Entering Studio...</span>
                ) : (
                  <>
                    <span>Enter Artisan Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-6 pt-5 border-t border-[#D8C7B2]/70 text-center space-y-2">
            <p className="text-[11px] text-[#756A60]">
              Quick evaluation access:
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-3 rounded-lg bg-[#EFE4D3] hover:bg-[#E2D4BF] text-[#6B4632] text-xs font-semibold border border-[#D8C7B2] flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A68A64]" />
              <span>Log in as {artisanName}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}