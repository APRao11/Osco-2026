import React from 'react';
import { ProfileForm } from '../components/ArtisanProfile.jsx';

export function ArtisanProfile({
  artisan,
  onSaveProfile,
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D8C7B2] pb-3">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#6B4632]">
          Artisan Profile & Maker Story
        </h1>
        <p className="text-xs text-[#756A60]">
          Manage your personal profile and maker story.
        </p>
      </div>

      <ProfileForm
        initialProfile={artisan}
        onSave={onSaveProfile}
      />
    </div>
  );
}