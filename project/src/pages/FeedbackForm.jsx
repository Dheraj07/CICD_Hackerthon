import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Eye, 
  EyeOff, 
  X, 
  Upload, 
  Image as ImageIcon, 
  User, 
  Mail, 
  ShoppingBag, 
  Globe, 
  Store, 
  Package, 
  Smartphone, 
  Tag, 
  Clock,
  Check,
  XCircle,
  MessageSquare,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useFeedback } from '../contexts/FeedbackContext.jsx';
import StarRating from '../components/StarRating.jsx';

const FeedbackForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    // User Information
    userName: '',
    userEmail: '',
    isAnonymous: false,
    
    // Product Information
    productName: '',
    purchaseLocation: '',
    platformName: '',
    
    // Feedback Details
    category: '',
    rating: 5,
    comment: '',
    
    // System
    dateTime: new Date().toISOString(),
    
    // File handling
    selectedFile: null,
    previewUrl: '',
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const { addFeedback } = useFeedback();
  const navigate = useNavigate();

  // Form options
  const purchaseLocations = [
    { value: 'online', label: 'Online', icon: <Globe className="h-4 w-4 mr-2" /> },
    { value: 'physical_store', label: 'Physical Store', icon: <Store className="h-4 w-4 mr-2" /> },
    { value: 'other', label: 'Other', icon: <ShoppingBag className="h-4 w-4 mr-2" /> }
  ];

  const categories = [
    { value: 'product_quality', label: 'Product Quality', icon: <Package className="h-4 w-4 mr-2" /> },
    { value: 'customer_service', label: 'Customer Service', icon: <User className="h-4 w-4 mr-2" /> },
    { value: 'delivery', label: 'Delivery/Logistics', icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
    { value: 'website_app', label: 'Website/App Experience', icon: <Smartphone className="h-4 w-4 mr-2" /> },
    { value: 'pricing', label: 'Pricing', icon: <Tag className="h-4 w-4 mr-2" /> },
    { value: 'other', label: 'Other', icon: <MoreHorizontal className="h-4 w-4 mr-2" /> }
  ];

  const popularPlatforms = [
    'Amazon', 'Flipkart', 'Myntra', 'eBay', 'Walmart',
    'Target', 'Best Buy', 'Company Website', 'Other'
  ];

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRatingChange = (newRating) => {
    setFormData(prev => ({
      ...prev,
      rating: newRating
    }));
  };

  const showPlatformField = formData.purchaseLocation === 'online';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid file type (JPG, PNG, GIF, PDF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      selectedFile: file,
      error: ''
    }));
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          previewUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        previewUrl: ''
      }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      selectedFile: null,
      previewUrl: ''
    }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.productName.trim()) {
      setError('Please enter the product name');
      return;
    }
    
    if (!formData.category) {
      setError('Please select a category');
      return;
    }
    
    if (!formData.comment.trim()) {
      setError('Please provide your feedback');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to submit feedback');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the file to a server here
      const imageUrl = formData.previewUrl || '';

      // Map internal category value to human-readable label for compatibility
      const selectedCategoryLabel = (categories.find(c => c.value === formData.category)?.label) || formData.category || '';
      
      // Prepare feedback data
      const feedbackData = {
        userId: user.id,
        userName: formData.isAnonymous ? 'Anonymous' : (formData.userName || user.name || 'User'),
        userEmail: formData.isAnonymous ? undefined : (formData.userEmail || user.email || ''),
        productName: formData.productName,
        purchaseLocation: formData.purchaseLocation,
        platformName: formData.platformName,
        category: selectedCategoryLabel,
        rating: formData.rating,
        comment: formData.comment,
        isAnonymous: formData.isAnonymous,
        imageUrl,
        dateTime: new Date().toISOString()
      };
      
      await addFeedback(feedbackData);
      
      // Show success message and reset form
      setError('');
      
      // Show success message with resolution time
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
      successDiv.innerHTML = `
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <div>
          <p class="font-semibold">Thank you for your feedback!</p>
          <p class="text-sm">Our team typically takes 2 business days to resolve feedback.</p>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      // Remove the message after 5 seconds
      setTimeout(() => {
        successDiv.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => successDiv.remove(), 500);
      }, 5000);
      
      // Reset form
      setFormData({
        userName: '',
        userEmail: '',
        isAnonymous: false,
        productName: '',
        purchaseLocation: '',
        platformName: '',
        category: '',
        rating: 5,
        comment: '',
        dateTime: new Date().toISOString(),
        selectedFile: null,
        previewUrl: ''
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
      setFormData({
        userName: '',
        userEmail: '',
        isAnonymous: false,
        productName: '',
        purchaseLocation: '',
        platformName: '',
        category: '',
        rating: 5,
        comment: '',
        dateTime: new Date().toISOString(),
        selectedFile: null,
        previewUrl: ''
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setError('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">Share Your Feedback</h1>
          <p className="text-blue-100">Your thoughts help us improve our products and services.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* User Information Section */}
          <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <User className="h-6 w-6 text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name {!formData.isAnonymous && <span className="text-red-500">*</span>}
                </label>
                <input
                  id="userName"
                  type="text"
                  value={formData.userName}
                  onChange={handleChange('userName')}
                  disabled={formData.isAnonymous}
                  required={!formData.isAnonymous}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formData.isAnonymous ? 'bg-gray-100' : 'bg-white'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address {!formData.isAnonymous && <span className="text-red-500">*</span>}
                </label>
                <input
                  id="userEmail"
                  type="email"
                  value={formData.userEmail}
                  onChange={handleChange('userEmail')}
                  disabled={formData.isAnonymous}
                  required={!formData.isAnonymous}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formData.isAnonymous ? 'bg-gray-100' : 'bg-white'
                  }`}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="isAnonymous"
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setFormData(prev => ({
                    ...prev,
                    isAnonymous: isChecked,
                    userName: isChecked ? '' : prev.userName,
                    userEmail: isChecked ? '' : prev.userEmail
                  }));
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
                Submit anonymously
              </label>
              {formData.isAnonymous && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <EyeOff className="h-3 w-3 mr-1" /> Your identity will be hidden
                </span>
              )}
            </div>
          </div>
          
          {/* Product Information Section */}
          <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
            </div>
            
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="productName"
                type="text"
                value={formData.productName}
                onChange={handleChange('productName')}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., iPhone 13 Pro, Web Dashboard"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="purchaseLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Where did you buy the product? <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 space-y-2">
                  {purchaseLocations.map((location) => (
                    <label key={location.value} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="purchaseLocation"
                        value={location.value}
                        checked={formData.purchaseLocation === location.value}
                        onChange={handleChange('purchaseLocation')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        required
                      />
                      <span className="ml-3 flex items-center">
                        {location.icon}
                        <span className="block text-sm text-gray-700">{location.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {showPlatformField && (
                <div>
                  <label htmlFor="platformName" className="block text-sm font-medium text-gray-700 mb-1">
                    Platform Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="platformName"
                      value={formData.platformName}
                      onChange={handleChange('platformName')}
                      required={showPlatformField}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a platform</option>
                      {popularPlatforms.map(platform => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>
                    {formData.platformName === 'Other' && (
                      <input
                        type="text"
                        value={formData.customPlatform || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, customPlatform: e.target.value }))}
                        placeholder="Please specify"
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={showPlatformField && formData.platformName === 'Other'}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Feedback Details Section */}
          <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Feedback Details</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you rate your experience? <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-4">
                <StarRating 
                  rating={formData.rating} 
                  onRatingChange={handleRatingChange} 
                  size="lg" 
                />
                <span className="text-lg font-medium text-gray-700">
                  {formData.rating} out of 5 stars
                </span>
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category of Feedback <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 grid grid-cols-1 gap-2">
                {categories.map((cat) => (
                  <label key={cat.value} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={formData.category === cat.value}
                      onChange={handleChange('category')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      required
                    />
                    <span className="ml-3 flex items-center">
                      {cat.icon}
                      <span className="block text-sm text-gray-700">{cat.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment"
                rows={5}
                value={formData.comment}
                onChange={handleChange('comment')}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Please share your detailed feedback..."
              />
              <div className="mt-1 flex justify-between text-sm text-gray-500">
                <span>{formData.comment.length}/1000 characters</span>
                <span>Minimum 30 characters</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              {!formData.previewUrl ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <div className="flex justify-center">
                      <Upload className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, PDF up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {formData.selectedFile?.type.startsWith('image/') ? (
                          <img
                            src={formData.previewUrl}
                            alt="Preview"
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded">
                            <FileText className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {formData.selectedFile?.name || 'File'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((formData.selectedFile?.size || 0) / 1024)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-400 hover:text-red-500 focus:outline-none"
                      title="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
              <span>Submission time: {new Date().toLocaleString()}</span>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <input
                id="termsAgreement"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="termsAgreement" className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
              >
                <XCircle className="h-5 w-5 mr-2" />
                Reset Form
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
