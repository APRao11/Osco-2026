import React, { useState } from 'react';
import { MeetTheMaker, ProfileForm } from '../components/ArtisanProfile.jsx';
import { BookOpen, Edit3 } from 'lucide-react';

const TABS = [
  { id: 'edit', label: 'Edit Profile', Icon: Edit3 },
  { id: 'preview', label: 'Meet the Maker View', Icon: BookOpen },
];

export function ArtisanProfile({
  artisan,
  onSaveProfile,
}) {
  const [activeTab, setActiveTab] = useState('edit');

  const showEdit = () => setActiveTab('edit');
  const showPreview = () => setActiveTab('preview');

  return (
    <div className="artisan-profile-page">
      {/* Header and Switcher */}
      <div className="artisan-profile-page-heading">
        <div>
          <h1 className="artisan-page-title">
            Artisan Profile & Maker Story
          </h1>
          <p className="artisan-muted artisan-small-text">
            Manage your personal profile and preview how buyers see &quot;Meet the Maker&quot;.
          </p>
        </div>

        <div className="artisan-profile-tabs">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`artisan-profile-tab ${activeTab === id ? 'is-active' : ''}`}
            >
              <Icon className="artisan-icon artisan-icon-small" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'edit' ? (
        <ProfileForm
          initialProfile={artisan}
          onSave={onSaveProfile}
          onPreviewMeetTheMaker={showPreview}
        />
      ) : (
        <div className="artisan-profile-preview">
          <div className="artisan-preview-note">
            <span className="artisan-muted">
              <strong className="artisan-text-strong">Public Buyer View:</strong> This is how your &quot;Meet the Maker&quot; story is presented to patrons on the marketplace.
            </span>
            <button onClick={showEdit} className="btn-secondary artisan-small-button">
              <Edit3 className="artisan-icon artisan-icon-small" />
              Edit Profile
            </button>
          </div>

          <MeetTheMaker
            artisan={artisan}
            onEditProfile={showEdit}
            showEditButton={true}
          />
        </div>
      )}
    </div>
  );
}