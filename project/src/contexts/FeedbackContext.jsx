import React, { createContext, useContext, useState, useEffect } from 'react';

const FeedbackContext = createContext(null);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return context;
};

const initialFeedbacks = [
  {
    id: '1',
    userId: '2',
    userName: 'John Customer',
    rating: 4,
    comment: 'Great service overall, but delivery could be faster.',
    category: 'Service Quality',
    date: '2024-01-15',
    status: 'resolved',
    isAnonymous: false,
    productService: 'Delivery Service'
  },
  {
    id: '2',
    userId: '3',
    userName: 'Anonymous',
    rating: 2,
    comment: 'Poor customer support response time.',
    category: 'Customer Support',
    date: '2024-01-14',
    status: 'in-progress',
    isAnonymous: true,
    productService: 'Support'
  },
  {
    id: '3',
    userId: '4',
    userName: 'Sarah Wilson',
    rating: 5,
    comment: 'Excellent product quality and fast shipping!',
    category: 'Product Quality',
    date: '2024-01-13',
    status: 'resolved',
    isAnonymous: false,
    productService: 'E-commerce'
  }
];

export const FeedbackProvider = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('feedbacks');
    return saved ? JSON.parse(saved) : initialFeedbacks;
    });

  useEffect(() => {
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const addFeedback = (feedback) => {
    const newFeedback = {
      ...feedback,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setFeedbacks(prev => [...prev, newFeedback]);
  };

  const updateFeedbackStatus = (id, status) => {
    setFeedbacks(prev => prev.map(f => (f.id === id ? { ...f, status } : f)));
  };

  const deleteFeedback = (id) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const getUserFeedbacks = (userId) => {
    return feedbacks.filter(f => f.userId === userId);
  };

  return (
    <FeedbackContext.Provider value={{
      feedbacks,
      addFeedback,
      updateFeedbackStatus,
      deleteFeedback,
      getUserFeedbacks
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};
