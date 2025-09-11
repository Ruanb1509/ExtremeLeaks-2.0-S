import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  Shield, 
  Globe, 
  MapPin,
  Edit,
  Eye,
  Heart,
  MessageCircle,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Button from '../components/ui/Button';

const YourAccount: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    language: user?.language || 'en',
    country: user?.country || ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    window.scrollTo(0, 0);
  }, [user, navigate]);

  const handleSave = async () => {
    try {
      // TODO: Implement profile update API call
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  if (!user) return null;

  return (
    <main className="pt-20 min-h-screen bg-dark-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <User className="w-8 h-8 text-primary-500 mr-3" />
            <h1 className="text-3xl font-bold text-white">Your Account</h1>
          </div>
          <p className="text-gray-400">Manage your profile and account settings</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-dark-200 rounded-xl p-6 border border-dark-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  <Button
                    variant={isEditing ? "primary" : "outline"}
                    size="sm"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <CheckCircle size={16} className="mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit size={16} className="mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-300 border border-dark-100 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-dark-300/50 rounded-lg">
                        <User size={18} className="text-primary-500 mr-3" />
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center px-4 py-3 bg-dark-300/50 rounded-lg">
                      <Mail size={18} className="text-primary-500 mr-3" />
                      <span className="text-white font-medium flex-1">{user.email}</span>
                      {user.isVerified ? (
                        <div className="flex items-center text-green-500">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-sm">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-500">
                          <XCircle size={16} className="mr-1" />
                          <span className="text-sm">Not Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Language
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-300 border border-dark-100 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ru">Русский</option>
                      </select>
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-dark-300/50 rounded-lg">
                        <Globe size={18} className="text-primary-500 mr-3" />
                        <span className="text-white font-medium">{user.language?.toUpperCase()}</span>
                      </div>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Country
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Enter your country"
                        className="w-full px-4 py-3 bg-dark-300 border border-dark-100 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-dark-300/50 rounded-lg">
                        <MapPin size={18} className="text-primary-500 mr-3" />
                        <span className="text-white font-medium">{user.country || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user.name,
                            language: user.language || 'en',
                            country: user.country || ''
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleSave}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="space-y-6">
              {/* Account Status */}
              <div className="bg-dark-200 rounded-xl p-6 border border-dark-100">
                <h3 className="text-lg font-bold text-white mb-4">Account Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Membership</span>
                    <div className="flex items-center">
                      {user.isPremium ? (
                        <>
                          <Crown size={16} className="text-yellow-500 mr-1" />
                          <span className="text-yellow-500 font-medium">Premium</span>
                        </>
                      ) : (
                        <span className="text-gray-400">Free</span>
                      )}
                    </div>
                  </div>

                  {user.isAdmin && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Role</span>
                      <div className="flex items-center">
                        <Shield size={16} className="text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">Admin</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Joined</span>
                    <span className="text-white font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {user.isPremium && user.expiredPremium && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Premium Expires</span>
                      <span className="text-yellow-500 font-medium">
                        {new Date(user.expiredPremium).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Stats */}
              <div className="bg-dark-200 rounded-xl p-6 border border-dark-100">
                <h3 className="text-lg font-bold text-white mb-4">Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Eye size={16} className="text-primary-500 mr-2" />
                      <span className="text-gray-400">Content Views</span>
                    </div>
                    <span className="text-white font-medium">-</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart size={16} className="text-red-500 mr-2" />
                      <span className="text-gray-400">Likes Given</span>
                    </div>
                    <span className="text-white font-medium">-</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageCircle size={16} className="text-blue-500 mr-2" />
                      <span className="text-gray-400">Comments</span>
                    </div>
                    <span className="text-white font-medium">-</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-dark-200 rounded-xl p-6 border border-dark-100">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {!user.isPremium && (
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => navigate('/premium')}
                    >
                      <Crown size={16} className="mr-2" />
                      Upgrade to Premium
                    </Button>
                  )}

                  {user.isPremium && (
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => navigate('/billing')}
                    >
                      <Settings size={16} className="mr-2" />
                      Manage Billing
                    </Button>
                  )}

                  {!user.isVerified && (
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        // TODO: Implement resend verification
                        alert('Verification email sent!');
                      }}
                    >
                      <Mail size={16} className="mr-2" />
                      Verify Email
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default YourAccount;