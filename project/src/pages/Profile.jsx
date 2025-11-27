import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useFeedback } from '../contexts/FeedbackContext.jsx';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Star, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { feedbacks } = useFeedback();
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Filter and sort feedbacks for the current user (newest first)
      const userFb = feedbacks
        .filter(fb => fb.userId === user.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setUserFeedbacks(userFb);
    }
  }, [user, feedbacks]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className="h-3.5 w-3.5 mr-1" />
      },
      'in-progress': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />
      },
      'resolved': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {status.replace('-', ' ')}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your profile</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* User Information Card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="mt-1 text-blue-100">Personal Information</p>
              </div>
              <span className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                {user.role === 'admin' ? 'Administrator' : 'Customer'}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-gray-900">{user.name || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">
                  {user.email ? (
                    <span className="font-mono">
                      {user.email.split('@')[0].substring(0, 3)}...@
                      {user.email.split('@')[1]}
                    </span>
                  ) : 'Not provided'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="text-gray-900">{formatDate(user.createdAt || new Date())}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Last Login</p>
                <p className="text-gray-900">{formatDate(user.lastLogin) || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submitted Feedback */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
              My Feedback Submissions
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {userFeedbacks.length} {userFeedbacks.length === 1 ? 'submission' : 'submissions'}
              </span>
            </h2>
          </div>
          
          {userFeedbacks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {userFeedbacks.map((feedback) => (
                <li key={feedback.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-base font-medium text-gray-900">
                          {feedback.productService || 'General Feedback'}
                        </h3>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(feedback.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {feedback.comment}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center space-x-3">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= feedback.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {getStatusBadge(feedback.status)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback submitted yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by submitting your first feedback.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/submit-feedback')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <MessageSquare className="-ml-1 mr-2 h-5 w-5" />
                  Submit Feedback
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
