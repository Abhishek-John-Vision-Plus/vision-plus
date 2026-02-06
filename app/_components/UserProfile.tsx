'use client';

import { useAuth } from '@/context/AuthContext';
import { User2, Calendar, Mail, Hash, Briefcase, Phone, User as UserIcon, Globe, Info } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
  };
};

export default function UserProfile({ user }: UserProfileProps) {
  const [extraDetails, setExtraDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExtraDetails = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/user-details?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setExtraDetails(data);
        }
      } catch (err) {
        console.error('Failed to fetch extra user details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExtraDetails();
  }, [user?.id]);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
      {/* Header/Banner Area */}
      <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              <Image
                src={'/profile/profile.avif'}
                alt="User Profile"
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* User Info Section */}
      <div className="pt-16 pb-8 px-6 text-center border-b border-slate-50">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {user.name}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            {user.role}
          </span>
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            {user.empId}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-6 space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Account Information</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <DetailItem icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
          <DetailItem icon={<Briefcase className="w-4 h-4" />} label="Process" value={user.process} />
          <DetailItem icon={<Phone className="w-4 h-4" />} label="Phone" value={user.phone || extraDetails?.phoneNumber || 'Not provided'} />
          
          {/* Newly requested fields */}
          <DetailItem icon={<UserIcon className="w-4 h-4" />} label="Gender" value={extraDetails?.gender || (loading ? 'Loading...' : 'Not specified')} />
          <DetailItem icon={<Globe className="w-4 h-4" />} label="Language" value={extraDetails?.language || (loading ? 'Loading...' : 'Not specified')} />
          
          <DetailItem icon={<Calendar className="w-4 h-4" />} label="Member Since" value={new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
        </div>

        {extraDetails && (
          <>
            <div className="h-px bg-slate-100 my-6"></div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <DetailItem icon={<Info className="w-4 h-4" />} label="Designation" value={extraDetails.designation} />
              <DetailItem icon={<UserIcon className="w-4 h-4" />} label="Team Lead" value={extraDetails.teamLead} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-slate-700">{value}</span>
      </div>
    </div>
  );
}

