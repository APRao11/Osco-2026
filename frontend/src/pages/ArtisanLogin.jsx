import React, { useState } from 'react';
import { Anchor, Sparkles, Key, Mail, ArrowRight } from 'lucide-react';

const DEMO_PASSWORD = 'coastal-crafts';

const INPUT_CLASS = 'artisan-login-input';

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
    <div className="artisan-login-page">
      <div className="artisan-login-content">
        {/* Brand Header */}
        <div className="artisan-login-brand">
          <div className="artisan-login-mark">
            <Anchor className="artisan-login-mark-icon" />
          </div>
          <span className="artisan-login-eyebrow">
            Coastal Crafts Marketplace
          </span>
          <h1 className="artisan-login-title">
            Artisan Studio Login
          </h1>
          <p className="artisan-login-description">
            Sign in to manage your workshop, craft stories, and handmade catalog.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="card artisan-login-card">
          <form onSubmit={handleSubmit} className="artisan-login-form">
            {error && (
              <div className="artisan-login-error">
                {error}
              </div>
            )}

            <div className="artisan-login-field">
              <label
                htmlFor="artisan-email"
                className="artisan-field-label"
              >
                Artisan Email / Username
              </label>
              <div className="artisan-login-input-wrap">
                <span className="artisan-login-input-icon">
                  <Mail className="artisan-icon" />
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

            <div className="artisan-login-field">
              <label
                htmlFor="artisan-password"
                className="artisan-field-label"
              >
                Password
              </label>
              <div className="artisan-login-input-wrap">
                <span className="artisan-login-input-icon">
                  <Key className="artisan-icon" />
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

            <div className="artisan-login-submit-wrap">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary artisan-login-submit"
              >
                {isLoading ? (
                  <span>Entering Studio...</span>
                ) : (
                  <>
                    <span>Enter Artisan Studio</span>
                    <ArrowRight className="artisan-icon" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Access */}
          <div className="artisan-login-demo">
            <p className="artisan-muted artisan-tiny-text">
              Quick evaluation access:
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="artisan-button artisan-button-draft artisan-login-demo-button"
            >
              <Sparkles className="artisan-icon artisan-icon-accent" />
              <span>Log in as {artisanName}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}