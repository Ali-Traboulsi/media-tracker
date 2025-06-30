'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { SparklesIcon, ChartBarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function AIPage() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchInsights();
      fetchRecommendations();
    }
  }, [isAuthenticated]);

  const fetchRecommendations = async (mediaType?: string) => {
    try {
      setLoading(true);
      const data = await apiService.getRecommendations(mediaType);
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      setInsightsLoading(true);
      const data = await apiService.getMediaInsights();
      setInsights(data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    fetchRecommendations(type);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MOVIE': return '🎬';
      case 'TV_SHOW': return '📺';
      case 'BOOK': return '📚';
      case 'GAME': return '🎮';
      case 'PODCAST': return '🎧';
      default: return '🌟';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please sign in to get AI-powered recommendations.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">AI Recommendations</h1>
          <p className="mt-2 text-sm text-gray-700">
            Get personalized recommendations and insights based on your media collection.
          </p>
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg text-white">
        <div className="px-6 py-8">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">Your Collection Insights</h2>
          </div>
          
          {insightsLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : insights ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{insights.totalItems}</div>
                <div className="text-sm opacity-90">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {insights.averageRating ? `${insights.averageRating}/10` : 'N/A'}
                </div>
                <div className="text-sm opacity-90">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Object.keys(insights.typeBreakdown || {}).length}
                </div>
                <div className="text-sm opacity-90">Media Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {insights.statusBreakdown?.COMPLETED || 0}
                </div>
                <div className="text-sm opacity-90">Completed</div>
              </div>
            </div>
          ) : (
            <p className="text-white/80">Unable to load insights</p>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <SparklesIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Personalized Recommendations</h2>
            </div>
            <button
              onClick={() => fetchRecommendations(selectedType)}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>

          {/* Media Type Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Get recommendations for:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTypeChange('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === ''
                    ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🌟 All Types
              </button>
              {['MOVIE', 'TV_SHOW', 'BOOK', 'GAME', 'PODCAST'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getTypeIcon(type)} {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Recommendations List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-sm text-gray-500">Generating personalized recommendations...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{recommendation}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedType ? `Recommended ${selectedType.replace('_', ' ').toLowerCase()}` : 'AI Recommendation'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add some rated media items to your collection to get personalized recommendations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collection Analysis */}
      {insights && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Type Distribution</h3>
              <div className="space-y-3">
                {Object.entries(insights.typeBreakdown || {}).map(([type, count]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getTypeIcon(type)}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{count} items</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h3>
              <div className="space-y-3">
                {Object.entries(insights.statusBreakdown || {}).map(([status, count]: [string, any]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-sm text-gray-500">{count} items</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
