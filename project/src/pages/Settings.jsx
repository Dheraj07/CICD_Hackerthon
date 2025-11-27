import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { User, Mail, Shield, EyeOff, Eye, Image as ImageIcon, Save, KeyRound, Trash2 } from 'lucide-react';

const Settings = () => {
  const { user, updateProfile, changePassword, setDefaultAnonymity, deactivateAccount, logout } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', avatarUrl: '' });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [anon, setAnon] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', email: user.email || '', avatarUrl: user.avatarUrl || '' });
      setAnon(!!user.defaultAnonymity);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow text-center">Please log in to view settings.</div>
      </div>
    );
  }

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ name: profile.name, email: profile.email, avatarUrl: profile.avatarUrl });
    setMessage({ type: 'success', text: 'Profile updated successfully.' });
    setTimeout(() => setMessage(null), 2500);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.next || passwords.next !== passwords.confirm) {
      setMessage({ type: 'error', text: 'New password and confirm password must match.' });
      return;
    }
    await changePassword(passwords.current, passwords.next);
    setPasswords({ current: '', next: '', confirm: '' });
    setMessage({ type: 'success', text: 'Password changed (demo only).' });
    setTimeout(() => setMessage(null), 2500);
  };

  const handleAnonToggle = (checked) => {
    setAnon(checked);
    setDefaultAnonymity(checked);
    setMessage({ type: 'success', text: `Default anonymity ${checked ? 'enabled' : 'disabled'}.` });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleDeactivate = () => {
    if (confirm('Are you sure you want to deactivate your account? This will sign you out.')) {
      deactivateAccount();
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600">Manage your profile, security, and preferences</p>
          </div>
          {message && (
            <div className={`px-4 py-2 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Edit Profile */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <h2 className="font-medium text-gray-900">Edit Profile</h2>
          </div>
          <form className="p-6 space-y-4" onSubmit={handleProfileSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Profile Picture URL (optional)</label>
                <div className="flex items-center space-x-3 mt-1">
                  <input value={profile.avatarUrl} onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })} className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="https://..." />
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="font-medium text-gray-900">Change Password</h2>
          </div>
          <form className="p-6 space-y-4" onSubmit={handlePasswordChange}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type={showPassword ? 'text' : 'password'} value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type={showPassword ? 'text' : 'password'} value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type={showPassword ? 'text' : 'password'} value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button type="button" className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (<><EyeOff className="h-4 w-4 mr-1"/>Hide</>) : (<><Eye className="h-4 w-4 mr-1"/>Show</>)}
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <KeyRound className="h-4 w-4 mr-2" /> Update Password
              </button>
            </div>
          </form>
        </div>

        {/* Anonymity Preference */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-2">
            <EyeOff className="h-5 w-5 text-blue-600" />
            <h2 className="font-medium text-gray-900">Anonymity Preference</h2>
          </div>
          <div className="p-6 flex items-center justify-between">
            <p className="text-gray-700">Default to "Submit Anonymously" when creating feedback</p>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={anon} onChange={(e) => handleAnonToggle(e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-300 peer-checked:bg-blue-600 relative">
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${anon ? 'translate-x-5' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white shadow rounded-lg border border-red-200">
          <div className="px-6 py-4 border-b border-red-100 flex items-center space-x-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            <h2 className="font-medium text-gray-900">Delete / Deactivate Account</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">This will sign you out and remove your local session. This is a demo app; no real backend deletion occurs.</p>
            <button onClick={handleDeactivate} className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" /> Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
