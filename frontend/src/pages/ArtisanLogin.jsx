import React, { useState } from 'react';
import { Anchor, Sparkles, Key, Mail, ArrowRight } from 'lucide-react';
import { loginArtisan } from '../data/artisanApi.js';

const DEMO_USERNAME = 'meenakshi-nayak';
const DEMO_PASSWORD = 'osco-demo';

const INPUT_CLASS = 'artisan-login-input';

export function ArtisanLogin({
  onLogin,
}) {
  const [username, setUsername] = useState(DEMO_USERNAME);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const authenticate = async (loginUsername, loginPassword) => {
    setError('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError('Please provide your artisan username and password.');
      return;
    }

    setIsLoading(true);
    try {
      const artisan = await loginArtisan(loginUsername.trim(), loginPassword);
      onLogin(artisan);
    } catch (loginError) {
      setError(loginError.message || 'Could not log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticate(username, password);
  };

  const handleQuickDemo = () => {
    setUsername(DEMO_USERNAME);
    setPassword(DEMO_PASSWORD);
    authenticate(DEMO_USERNAME, DEMO_PASSWORD);
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
                htmlFor="artisan-username"
                className="artisan-field-label"
              >
                Artisan Username
              </label>
              <div className="artisan-login-input-wrap">
                <span className="artisan-login-input-icon">
                  <Mail className="artisan-icon" />
                </span>
                <input
                  id="artisan-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="meenakshi-nayak"
                  className={INPUT_CLASS}
                  autoComplete="username"
                  required
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
                  autoComplete="current-password"
                  required
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
              Demo login: <strong>meenakshi-nayak</strong> / <strong>osco-demo</strong> or <strong>rukmini-shetty</strong> / <strong>osco-demo</strong>.
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="artisan-button artisan-button-draft artisan-login-demo-button"
              disabled={isLoading}
            >
              <Sparkles className="artisan-icon artisan-icon-accent" />
              <span>Log in as Meenakshi Nayak</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}