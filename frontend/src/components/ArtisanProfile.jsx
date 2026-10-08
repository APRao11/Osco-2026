import { useState } from 'react';
import {
  User,
  MapPin,
  Sparkles,
  Award,
  Video,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  Store,
  Calendar,
  Edit3,
  Anchor,
} from 'lucide-react';
import { ImageUpload } from './ImageUpload.jsx';

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

// every input shares the same look, so it lives in one place
const inputStyle =
  'w-full text-xs p-3 rounded-lg border border-[#D8C7B2] bg-white focus:outline-none focus:ring-1 focus:ring-[#6B4632] text-[#2F2924]';

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
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#2F2924]">
        {label} {rest.required && <span className="text-[#6B4632]">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 w-3.5 h-3.5 text-[#756A60]" />}
        <Tag
          {...(!textarea && { type })}
          value={value ?? ''}
          onChange={handle}
          className={`${inputStyle} ${Icon ? 'pl-8' : ''} ${textarea ? 'resize-none' : ''}`}
          {...rest}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile form                                                        */
/* ------------------------------------------------------------------ */

export function ProfileForm({ initialProfile, onSave }) {
  const [profile, setProfile] = useState({ ...initialProfile });
  const [saved, setSaved] = useState(false);

  const update = (field, value) => setProfile((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(profile);

    // show the success banner briefly, then hide it
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // props shared by every field
  const f = (name) => ({ name, value: profile[name], onChange: update });

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            Profile updated successfully!
          </span>
        </div>
      )}

      {/* header with the main actions */}
      <div className="bg-[#FFF9F0] p-6 rounded-xl border border-[#D8C7B2] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#6B4632]">Artisan Profile & Maker Story</h2>
          <p className="text-xs text-[#756A60] mt-1">Tell buyers who you are and what goes into your craft.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary text-xs">
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </div>

      {/* basic details */}
      <div className="card p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-serif font-bold text-[#6B4632] flex items-center gap-2 border-b border-[#D8C7B2]/70 pb-3">
          <User className="w-4 h-4 text-[#A68A64]" /> Personal & Workshop Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ImageUpload
            currentImage={profile.photo}
            onImageChange={(url) => update('photo', url)}
            label="Artisan Portrait Photo"
          />

          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field {...f('name')} label="Artisan Name" required placeholder="e.g. Meera Nambiar" />
              <Field {...f('workshopName')} label="Workshop / Studio Name" icon={Store} placeholder="e.g. Sunderban Coir Atelier" />
              <Field {...f('location')} label="Location / Village" icon={MapPin} required placeholder="e.g. Varkala, Kerala" />
              <Field
                {...f('yearsOfExperience')}
                value={profile.yearsOfExperience || 1}
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
      <div className="card p-6 sm:p-8 space-y-5">
        <div className="border-b border-[#D8C7B2]/70 pb-3">
          <h3 className="text-base font-serif font-bold text-[#6B4632]">
            &quot;Meet the Maker&quot; Information{' '}
            <span className="text-[11px] font-semibold bg-[#EFE4D3] px-2 py-0.5 rounded-full border border-[#D8C7B2]">
              Displayed to Buyers
            </span>
          </h3>
          <p className="text-xs text-[#756A60]">Share your journey, lineage and workshop story.</p>
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
        <Field
          {...f('video')}
          label="Workshop Video URL (optional)"
          icon={Video}
          type="url"
          placeholder="https://www.youtube.com/embed/..."
        />
      </div>

      {/* contact info */}
      <div className="card p-6 bg-[#FFF9F0] border border-[#D8C7B2] space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#756A60]">Contact Records</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field {...f('email')} label="Email" icon={Mail} type="email" />
          <Field {...f('phone')} label="Phone" icon={Phone} type="tel" />
        </div>
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
    { icon: Calendar, text: `${artisan.yearsOfExperience} Years Craft Experience` },
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

  // only YouTube / Vimeo links can be embedded, anything else becomes a plain link
  const canEmbed = /youtube\.com|vimeo\.com/.test(artisan.video || '');

  return (
    <div className="card overflow-hidden shadow-xs border-[#D8C7B2]">
      {/* top banner */}
      <div className="bg-[#6B4632] px-6 py-4 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Anchor className="w-5 h-5 text-[#A68A64]" />
          <div>
            <span className="text-[11px] tracking-wider uppercase text-[#EFE4D3] font-medium block">
              Coastal Crafts Provenance
            </span>
            <h2 className="text-xl font-serif font-bold tracking-wide">Meet the Maker</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8A6248] text-xs text-[#FFF9F0] border border-[#A68A64]/40 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Verified Master Artisan
          </span>
          {showEditButton && onEditProfile && (
            <button
              onClick={onEditProfile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF9F0] text-[#6B4632] hover:bg-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-7">
        {/* photo and key details */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-36 h-36 md:w-40 md:h-40 shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden border-2 border-[#D8C7B2] shadow-xs bg-[#EFE4D3]">
            <img src={artisan.photo || fallbackPhoto} alt={artisan.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-3 text-center md:text-left">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#756A60] font-semibold">
                {artisan.workshopName || 'Artisan Workshop'}
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#2F2924]">{artisan.name}</h3>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#756A60] font-medium">
              {facts.map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1">
                  <Icon className="w-4 h-4 text-[#8A6248]" /> {text}
                </span>
              ))}
            </div>

            <p className="text-sm text-[#2F2924] italic font-serif leading-relaxed bg-[#F5EBDD]/60 p-3.5 rounded-lg border-l-3 border-[#6B4632]">
              &ldquo;{artisan.bio}&rdquo;
            </p>
          </div>
        </div>

        {/* story boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#D8C7B2]/70">
          {stories.map(({ icon: Icon, title, text }) => (
            <div key={title} className="space-y-2 bg-[#F5EBDD]/40 p-5 rounded-xl border border-[#D8C7B2]/80">
              <h4 className="text-sm font-serif font-bold text-[#6B4632] flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#A68A64]" /> {title}
              </h4>
              <p className="text-xs text-[#2F2924] leading-relaxed whitespace-pre-line">{text}</p>
            </div>
          ))}
        </div>

        {/* workshop video, shown only if the artisan added one */}
        {artisan.video && (
          <div className="space-y-3 pt-2 border-t border-[#D8C7B2]/70">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-serif font-bold text-[#6B4632] flex items-center gap-2">
                <Video className="w-4 h-4 text-[#A68A64]" /> Workshop & Craft Demonstration Video
              </h4>
              <span className="text-[11px] text-[#756A60]">Shows hands-on weaving & carving techniques</span>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#D8C7B2] bg-[#2F2924]/10 shadow-inner flex items-center justify-center">
              {canEmbed ? (
                <iframe
                  src={artisan.video}
                  title="Artisan craft workshop video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="p-8 text-center space-y-2">
                  <Video className="w-8 h-8 text-[#6B4632] mx-auto opacity-70" />
                  <p className="text-xs font-semibold text-[#2F2924]">Video Link</p>
                  <a
                    href={artisan.video}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#6B4632] underline hover:text-[#8A6248] block truncate max-w-md mx-auto"
                  >
                    {artisan.video}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}