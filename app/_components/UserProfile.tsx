'use client';

import {
  Mail,
  Calendar,
  Briefcase,
  Phone,
  User as UserIcon,
  Globe,
  Info,
  Camera
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type UserProfileProps = {
  user: {
    id: string;
    name: string;
    email: string;
    empId: string;
    phone: string;
    role: string;
    process: string;
    createdAt: string;
    avatarUrl?: string;
  };
};

export default function UserProfile({ user }: UserProfileProps) {
  const [extraDetails, setExtraDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(user.avatarUrl || '/profile/profile.avif');

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);

    fetch(`/api/user-details?userId=${user.id}`)
      .then(res => res.json())
      .then(setExtraDetails)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  /* ----------------------------------
     Handle Profile Image Upload
  ---------------------------------- */
  const handleImageChange = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setAvatar(preview);

    // TODO: Upload to backend (Cloudinary/S3)
    // const formData = new FormData();
    // formData.append('file', file);
    // await fetch('/api/upload-avatar', { method: 'POST', body: formData });
  };

  return (
    <div className="max-w-md mx-auto rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl">
      {/* Header */}
      <div className="relative h-36 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600">
        {/* Avatar */}
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
          <div
            className="relative w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden group cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <Image
              src={avatar}
              alt="Profile"
              fill
              className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files && handleImageChange(e.target.files[0])}
          />
        </div>
      </div>

      {/* User Info */}
      <div className="pt-20 px-6 text-center border-b">
        <h2 className="text-2xl font-extrabold text-slate-900">
          {user.name}
        </h2>

        <div className="flex justify-center gap-2 mt-2">
          <Badge>{user.role}</Badge>
          <Badge variant="muted">{user.empId}</Badge>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-6">
        <Section title="Account Information">
          <Detail icon={<Mail />} label="Email" value={user.email} />
          <Detail icon={<Briefcase />} label="Process" value={user.process} />
          <Detail icon={<Phone />} label="Phone" value={user.phone || '—'} />
          <Detail icon={<UserIcon />} label="Gender" value={extraDetails?.gender || '—'} />
          <Detail icon={<Globe />} label="Language" value={extraDetails?.language || '—'} />
          <Detail
            icon={<Calendar />}
            label="Member Since"
            value={new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          />
        </Section>

        {extraDetails && (
          <Section title="Additional Details">
            <Detail icon={<Info />} label="Designation" value={extraDetails.designation} />
            <Detail icon={<UserIcon />} label="Team Lead" value={extraDetails.teamLead} />
          </Section>
        )}
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="text-[11px] font-black tracking-widest text-slate-400 uppercase mb-4">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Detail({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase text-slate-400">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function Badge({ children, variant = 'default' }: any) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase
        ${variant === 'muted'
          ? 'bg-slate-100 text-slate-500'
          : 'bg-indigo-100 text-indigo-700'}`}
    >
      {children}
    </span>
  );
}
