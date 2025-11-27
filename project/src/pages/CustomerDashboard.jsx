import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useFeedback } from '../contexts/FeedbackContext.jsx';
import FeedbackCard from '../components/FeedbackCard.jsx';
import StarRating from '../components/StarRating.jsx';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { getUserFeedbacks } = useFeedback();
  const userFeedbacks = user ? getUserFeedbacks(user.id) : [];

  const stats = {
    total: userFeedbacks.length,
    pending: userFeedbacks.filter(f => f.status === 'pending').length,
    inProgress: userFeedbacks.filter(f => f.status === 'in-progress').length,
    resolved: userFeedbacks.filter(f => f.status === 'resolved').length,
    averageRating: userFeedbacks.length > 0 
      ? userFeedbacks.reduce((sum, f) => sum + f.rating, 0) / userFeedbacks.length 
      : 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Track your feedback submissions and see their status updates.</p>
      </div>
      <div className="mb-8">
        <Link to="/submit-feedback" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg">
          <PlusCircle className="h-5 w-5 mr-2" />
          Submit New Feedback
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.resolved}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <div className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <StarRating rating={Math.round(stats.averageRating)} readonly size="sm" />
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Feedback History</h2>
        {userFeedbacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
            <p className="text-gray-600 mb-6">Start sharing your thoughts and experiences with us.</p>
            <Link to="/submit-feedback" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <PlusCircle className="h-4 w-4 mr-2" />
              Submit Your First Feedback
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {userFeedbacks
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(feedback => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
