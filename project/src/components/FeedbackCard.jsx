import React from 'react';
import { Calendar, User, Tag, MoreVertical, Trash2, Image as ImageIcon } from 'lucide-react';
import StarRating from './StarRating.jsx';

const FeedbackCard = ({ feedback, onStatusChange, onDelete, isAdmin = false }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {feedback.isAnonymous ? 'Anonymous' : feedback.userName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{feedback.date}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[feedback.status]}`}>
            {feedback.status.replace('-', ' ')}
          </span>
          {isAdmin && (
            <div className="relative group">
              <button className="p-1 rounded hover:bg-gray-100">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <StarRating rating={feedback.rating} readonly size="sm" />
      </div>

      <p className="text-gray-800 mb-4 leading-relaxed">{feedback.comment}</p>
      
      {feedback.imageUrl && (
        <div className="mt-3 mb-4">
          <div className="relative group">
            <img
              src={feedback.imageUrl}
              alt="Feedback attachment"
              className="max-h-64 max-w-full rounded-lg border border-gray-200 object-contain"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          {feedback.productName && (
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{feedback.productName}</span>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
              <Tag className="h-3 w-3 mr-1" />
              {feedback.category}
            </span>
            {feedback.productService && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                {feedback.productService}
              </span>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center space-x-2">
            <select
              value={feedback.status}
              onChange={(e) => onStatusChange && onStatusChange(feedback.id, e.target.value)}
              className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <button
              onClick={() => onDelete && onDelete(feedback.id)}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard;
