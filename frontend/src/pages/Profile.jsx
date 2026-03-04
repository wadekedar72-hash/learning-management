import React from 'react';
import { AppShell } from '../components/Layout/AppShell';
import { AuthGuard } from '../components/Auth/AuthGuard';
import { useAuthStore } from '../store/authStore';
import { User, Mail } from 'lucide-react';

export function Profile() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { user } = useAuthStore();

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

        <div className="card p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{user?.name}</h2>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Learning Statistics
            </h3>
            <p className="text-gray-600">
              Your learning progress and statistics will appear here.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
