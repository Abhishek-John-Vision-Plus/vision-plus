'use client';

import { useAuth } from '@/context/AuthContext';
import { User2 } from 'lucide-react';
import Image from 'next/image';

type UserProfileProps = {
  user: {
    name: string;
    email: string;
    empid: string;
    phone: string;
    role: string;
    process: string;
    
    createdAt: string;
  };
};

export default function UserProfile({ user }: UserProfileProps) {
    // const { user } = useAuth();
    console.log('user',user);
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
     
      {/* Profile Image */}
      <div className="flex justify-center">
        {user?<Image
          src={  '/profile/profile.avif'}
          alt="User Profile"
          width={100}
          height={100}
          className="rounded-full border"
        />:<User2 className="w-16 h-16 text-indigo-600 border-2 border-indigo-600 rounded-full" />
}
      </div>

      {/* User Info */}
      <div className="text-center mt-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {user?.name || 'User Name'}
        </h2>

        {user?.role && (
          <p className="text-sm text-indigo-600 font-medium">
            {user.role}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="mt-6 space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span>{user?.email}</span>
        </div>
 {user?.empid && (
          <div className="flex justify-between">
            <span className="font-medium">Employee ID:</span>
            <span>{user.empid}</span>
          </div>
        )}
        {user?.process && (
          <div className="flex justify-between">
            <span className="font-medium">Process:</span>
            <span>{user.process}</span>
          </div>
        )}
        {user?.phone && (
          <div className="flex justify-between">
            <span className="font-medium">Phone:</span>
            <span>{user.phone}</span>
          </div>
        )}
         {user?.createdAt  && (
          <div className="flex justify-between">
            <span className="font-medium">Created:</span>
            <span>{user.createdAt}</span>
          </div>
        )}
      </div>

    </div>
  );
}
