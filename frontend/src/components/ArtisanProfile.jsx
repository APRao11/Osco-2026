import React from 'react';
import { useState } from 'react';
import {
  User,
  MapPin,
  Sparkles,
  Award,
  Save,
  CheckCircle2,
  Store,
  BookOpen,
  Calendar,
  Edit3,
  Anchor,
} from 'lucide-react';
import { ImageUpload } from './ImageUpload.jsx';

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

// every input shares the same look, so it lives in one place
const inputStyle = 'artisan-field-input';

const fallbackPhoto =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';

// small reusable field: label + optional icon + input/textarea
function Field({ label, name, value, onChange, icon: Icon, textarea, type = 'text', ...rest }) {
  const Tag = textarea ? 'textarea' : 'input';

  const handle = (e) => {
    const val = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(name, val);
  };

  return (
    <div className="artisan-profile-field">
      <label className="artisan-field-label">
        {label} {rest.required && <span className="artisan-required-mark">*</span>}
      </label>
      <div className={`artisan-profile-input-wrap ${Icon ? 'has-icon' : ''}`}>
        {Icon && <Icon className="artisan-field-icon" />}
        <Tag
          {...(!textarea && { type })}
          value={value ?? ''}
          onChange={handle}
          className={`${inputStyle} ${textarea ? 'artisan-field-textarea' : ''}`}
          {...rest}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile form                                                        */
/* ------------------------------------------------------------------ */

export function ProfileForm({ initialProfile, onSave, onPreviewMeetTheMaker }) {
  const [profile, setProfile] = useState({ ...initialProfile });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (field, value) => setProfile((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const persistedProfile = await onSave(profile);
      setProfile({ ...profile, ...persistedProfile });
      setSaved(true);
    } catch (saveError) {
      setError(saveError.message || 'Could not save artisan profile.');
    } finally {
      setSaving(false);
    }
  };

  // props shared by every field
  const f = (name) => ({ name, value: profile[name], onChange: update });

  return (
    <form onSubmit={handleSubmit} className="artisan-profile-form">
      {saved && (
        <div className="artisan-success-banner">
          <span className="artisan-success-message">
            <CheckCircle2 className="artisan-icon artisan-icon-success" />
            Artisan profile and Meet the Maker story saved.
          </span>
          <button type="button" onClick={onPreviewMeetTheMaker} className="artisan-text-link artisan-link-strong">
            Preview Meet the Maker →
          </button>
        </div>
      )}

      {/* header with the main actions */}
      <div className="artisan-profile-form-heading">
        <div>
          <h2 className="artisan-heading-secondary">Artisan Profile & Maker Story</h2>
          <p className="artisan-muted artisan-small-text artisan-heading-description">Tell buyers who you are and what goes into your craft.</p>
        </div>
        <div className="artisan-action-row">
          <button type="button" onClick={onPreviewMeetTheMaker} className="btn-secondary artisan-small-button">
            <BookOpen className="artisan-icon" /> Preview
          </button>
          <button type="submit" className="btn-primary artisan-small-button" disabled={saving}>
            <Save className="artisan-icon" /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      {error && <p className="artisan-login-error" role="alert">{error}</p>}

      {/* basic details */}
      <div className="card artisan-profile-section">
        <h3 className="artisan-section-title">
          <User className="artisan-icon artisan-icon-accent" /> Personal & Workshop Details
        </h3>

        <div className="artisan-profile-basics-grid">
          <ImageUpload
            currentImage={profile.photo}
            onImageChange={(url) => update('photo', url)}
            label="Artisan Portrait Photo"
          />

          <div className="artisan-profile-fields-column">
            <div className="artisan-profile-fields-grid">
              <Field {...f('name')} label="Artisan Name" required placeholder="e.g. Meera Nambiar" />
              <Field {...f('workshopName')} label="Workshop / Studio Name" icon={Store} placeholder="e.g. Sunderban Coir Atelier" />
              <Field {...f('location')} label="Location / Village" icon={MapPin} required placeholder="e.g. Varkala, Kerala" />
              <Field
                {...f('yearsOfExperience')}
                value={profile.yearsOfExperience ?? ''}
                label="Years of Craft Experience"
                icon={Award}
                type="number"
                min="1"
              />
            </div>

            <Field
              {...f('craftSpeciality')}
              label="Craft Speciality"
              icon={Sparkles}
              required
              placeholder="e.g. Handwoven Coir & Carved Coconut Shell Ware"
            />
            <Field
              {...f('bio')}
              label="Short Bio (One-line Summary)"
              required
              placeholder="Brief summary of your craft and vision..."
            />
          </div>
        </div>
      </div>

      {/* story shown on the Meet the Maker page */}
      <div className="card artisan-profile-section artisan-story-form-section">
        <div className="artisan-section-heading">
          <h3 className="artisan-section-heading-title">
            &quot;Meet the Maker&quot; Information{' '}
            <span className="artisan-buyer-label">
              Displayed to Buyers
            </span>
          </h3>
          <p className="artisan-muted artisan-small-text">Share your journey, lineage and workshop story.</p>
        </div>

        <Field
          {...f('craftBackground')}
          label="Craft Background & Lineage"
          textarea
          rows={4}
          required
          placeholder="How did you learn the craft, and who taught you?"
        />
        <Field
          {...f('makerStory')}
          label="Maker Story & Daily Studio Ritual"
          textarea
          rows={5}
          required
          placeholder="Describe your process, your materials, and the care in each piece..."
        />
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Meet the Maker (public view)                                        */
/* ------------------------------------------------------------------ */

export function MeetTheMaker({ artisan, onEditProfile, showEditButton = true }) {
  // the three small facts under the name
  const facts = [
    { icon: MapPin, text: artisan.location },
    ...(artisan.yearsOfExperience ? [{ icon: Calendar, text: `${artisan.yearsOfExperience} Years Craft Experience` }] : []),
    { icon: Sparkles, text: artisan.craftSpeciality },
  ];

  // the two story boxes, each with a default line if the artisan left it empty
  const stories = [
    {
      icon: Sparkles,
      title: 'Ancestral Lineage & Craft Background',
      text: artisan.craftBackground || 'Generations of coastal craft heritage.',
    },
    {
      icon: Anchor,
      title: "The Maker's Philosophy & Studio Daily Ritual",
      text: artisan.makerStory || 'Dedicated to handcrafting honest, sustainable coastal items.',
    },
  ];

  return (
    <div className="card artisan-maker-card">
      {/* top banner */}
      <div className="artisan-maker-banner">
        <div className="artisan-maker-brand">
          <Anchor className="artisan-icon artisan-icon-accent artisan-icon-large" />
          <div>
            <span className="artisan-maker-eyebrow">
              Coastal Crafts Provenance
            </span>
            <h2 className="artisan-maker-title">Meet the Maker</h2>
          </div>
        </div>

        <div className="artisan-maker-actions">
          <span className="artisan-verified-badge">
            <CheckCircle2 className="artisan-icon artisan-icon-verified" /> Artisan profile
          </span>
          {showEditButton && onEditProfile && (
            <button
              onClick={onEditProfile}
              className="artisan-button artisan-button-light artisan-maker-edit"
            >
              <Edit3 className="artisan-icon" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="artisan-maker-content">
        {/* photo and key details */}
        <div className="artisan-maker-overview">
          <div className="artisan-maker-photo">
            <img src={artisan.photo || fallbackPhoto} alt={artisan.name} />
          </div>

          <div className="artisan-maker-intro">
            <div>
              <span className="artisan-eyebrow artisan-muted">
                {artisan.workshopName || 'Artisan Workshop'}
              </span>
              <h3 className="artisan-maker-name">{artisan.name}</h3>
            </div>

            <div className="artisan-maker-facts">
              {facts.map(({ icon: Icon, text }) => (
                <span key={text} className="artisan-maker-fact">
                  <Icon className="artisan-icon artisan-icon-primary-light" /> {text}
                </span>
              ))}
            </div>

            <p className="artisan-maker-bio">
              &ldquo;{artisan.bio}&rdquo;
            </p>
          </div>
        </div>

        {/* story boxes */}
        <div className="artisan-maker-stories">
          {stories.map(({ icon: Icon, title, text }) => (
            <div key={title} className="artisan-maker-story">
              <h4 className="artisan-story-title">
                <Icon className="artisan-icon artisan-icon-accent" /> {title}
              </h4>
              <p className="artisan-story-copy">{text}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}