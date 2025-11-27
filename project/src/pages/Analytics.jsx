import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, Star, MessageSquare, BarChart2, PieChart, Activity, Filter } from 'lucide-react';
import { useFeedback } from '../contexts/FeedbackContext.jsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, ComposedChart, Scatter
} from 'recharts';

const Analytics = () => {
  const { feedbacks } = useFeedback();

  const analytics = useMemo(() => {
    const totalFeedback = feedbacks.length;
    const averageRating = totalFeedback > 0 
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedback 
      : 0;

    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: feedbacks.filter(f => f.rating === rating).length,
      percentage: totalFeedback > 0 ? (feedbacks.filter(f => f.rating === rating).length / totalFeedback) * 100 : 0
    }));

    const categoryMap = new Map();
    feedbacks.forEach(f => {
      categoryMap.set(f.category, (categoryMap.get(f.category) || 0) + 1);
    });
    const categoryDistribution = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count, percentage: totalFeedback > 0 ? (count / totalFeedback) * 100 : 0 }))
      .sort((a, b) => b.count - a.count);

    const statusDistribution = [
      { status: 'pending', count: feedbacks.filter(f => f.status === 'pending').length },
      { status: 'in-progress', count: feedbacks.filter(f => f.status === 'in-progress').length },
      { status: 'resolved', count: feedbacks.filter(f => f.status === 'resolved').length }
    ];

    const monthlyTrends = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toISOString().substr(0, 7);
      const monthFeedbacks = feedbacks.filter(f => f.date.startsWith(monthStr));
      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: monthFeedbacks.length,
        averageRating: monthFeedbacks.length > 0 
          ? monthFeedbacks.reduce((sum, f) => sum + f.rating, 0) / monthFeedbacks.length 
          : 0
      });
    }

    const positiveCount = feedbacks.filter(f => f.rating >= 4).length;
    const neutralCount = feedbacks.filter(f => f.rating === 3).length;
    const negativeCount = feedbacks.filter(f => f.rating <= 2).length;

    return {
      totalFeedback,
      averageRating,
      ratingDistribution,
      categoryDistribution,
      statusDistribution,
      monthlyTrends,
      satisfaction: {
        positive: { count: positiveCount, percentage: totalFeedback > 0 ? (positiveCount / totalFeedback) * 100 : 0 },
        neutral: { count: neutralCount, percentage: totalFeedback > 0 ? (neutralCount / totalFeedback) * 100 : 0 },
        negative: { count: negativeCount, percentage: totalFeedback > 0 ? (negativeCount / totalFeedback) * 100 : 0 }
      }
    };
  }, [feedbacks]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const RADIAN = Math.PI / 180;

  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="#4B5563" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
            <p className="text-gray-600">Comprehensive analysis of customer feedback trends and patterns.</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter Data
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">{analytics.totalFeedback}</div>
              <div className="text-sm text-blue-700">Total Feedback</div>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-900">{analytics.averageRating.toFixed(1)}</div>
              <div className="text-sm text-green-700">Average Rating</div>
            </div>
            <Star className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-900">{analytics.satisfaction.positive.percentage.toFixed(1)}%</div>
              <div className="text-sm text-purple-700">Satisfaction Rate</div>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-900">{new Set(feedbacks.map(f => f.userId)).size}</div>
              <div className="text-sm text-orange-700">Unique Users</div>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[...analytics.ratingDistribution].reverse().map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
                <span className="text-sm text-gray-500 w-12">{percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Sentiment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Positive (4-5 stars)</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-900">{analytics.satisfaction.positive.count}</div>
                <div className="text-sm text-green-700">{analytics.satisfaction.positive.percentage.toFixed(1)}%</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <span className="h-5 w-5 bg-yellow-400 rounded-full"></span>
                <span className="font-medium text-yellow-900">Neutral (3 stars)</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-900">{analytics.satisfaction.neutral.count}</div>
                <div className="text-sm text-yellow-700">{analytics.satisfaction.neutral.percentage.toFixed(1)}%</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-900">Negative (1-2 stars)</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-900">{analytics.satisfaction.negative.count}</div>
                <div className="text-sm text-red-700">{analytics.satisfaction.negative.percentage.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Feedback by Category - Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Feedback by Category</h3>
            <BarChart2 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.categoryDistribution}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} feedbacks`, 'Count']}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Legend />
                <Bar dataKey="count" name="Number of Feedbacks" fill="#3B82F6" radius={[4, 4, 0, 0]}
                  onClick={(data) => console.log('Category clicked:', data.category)}>
                  {analytics.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution - Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
            <PieChart className="h-5 w-5 text-purple-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={analytics.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="category"
                >
                  {analytics.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} (${((value / analytics.totalFeedback) * 100).toFixed(1)}%)`,
                    props.payload.category
                  ]}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Status Overview - Radar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Status Overview</h3>
            <Activity className="h-5 w-5 text-green-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.statusDistribution.map(status => ({
                ...status,
                label: status.status === 'in-progress' ? 'In Progress' : status.status.charAt(0).toUpperCase() + status.status.slice(1)
              }))}>
                <PolarGrid />
                <PolarAngleAxis dataKey="label" />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 2']} />
                <Radar name="Status Count" dataKey="count" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Tooltip 
                  formatter={(value, name, props) => [
                    value,
                    props.payload.label
                  ]}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trends - Area Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Feedback Trends</h3>
          <TrendingUp className="h-5 w-5 text-blue-500" />
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={analytics.monthlyTrends}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#ff7300" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'Average Rating') return [value, name];
                  return [value, 'Feedback Count'];
                }}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="count" name="Feedback Count" fill="#8884d8" stroke="#8884d8" />
              <Line yAxisId="right" type="monotone" dataKey="averageRating" name="Average Rating" stroke="#ff7300" />
              <Scatter yAxisId="right" dataKey="averageRating" fill="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rating Distribution - Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
          <Star className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[...analytics.ratingDistribution].reverse()}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="rating" type="category" tickFormatter={(value) => `${value} ★`} />
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value} (${((value / analytics.totalFeedback) * 100).toFixed(1)}%)`,
                  'Count'
                ]}
                labelFormatter={(label) => `Rating: ${label} stars`}
              />
              <Legend />
              <Bar dataKey="count" name="Number of Ratings" fill="#F59E0B" radius={[0, 4, 4, 0]}>
                {analytics.ratingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.rating >= 4 ? '#10B981' : 
                    entry.rating === 3 ? '#F59E0B' : '#EF4444'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
