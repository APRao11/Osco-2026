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
    <div className="space-y-6">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D8C7B2] pb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#6B4632]">
            Artisan Profile & Maker Story
          </h1>
          <p className="text-xs text-[#756A60]">
            Manage your personal profile and preview how buyers see &quot;Meet the Maker&quot;.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#EFE4D3] p-1 rounded-xl border border-[#D8C7B2]">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === id
                  ? 'bg-[#6B4632] text-white shadow-xs'
                  : 'text-[#2F2924] hover:text-[#6B4632]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
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
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-4 bg-[#EFE4D3]/70 rounded-xl border border-[#D8C7B2] flex items-center justify-between text-xs">
            <span className="text-[#756A60]">
              <strong className="text-[#2F2924]">Public Buyer View:</strong> This is how your &quot;Meet the Maker&quot; story is presented to patrons on the marketplace.
            </span>
            <button onClick={showEdit} className="btn-secondary text-xs">
              <Edit3 className="w-3.5 h-3.5" />
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