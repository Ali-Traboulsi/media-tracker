'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function StatusPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMediaStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'WATCHING': return 'bg-blue-500';
      case 'WANT_TO_WATCH': return 'bg-yellow-500';
      case 'ON_HOLD': return 'bg-orange-500';
      case 'DROPPED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MOVIE': return '🎬';
      case 'TV_SHOW': return '📺';
      case 'BOOK': return '📚';
      case 'GAME': return '🎮';
      case 'PODCAST': return '🎧';
      default: return '📄';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please sign in to view your status tracking.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-sm text-gray-500">Loading your statistics...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Status Tracking</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of your media collection progress and statistics.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">#</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats?.totalItems || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">⭐</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.averageRating ? `${stats.averageRating}/10` : 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.breakdown?.find((item: any) => item.status === 'COMPLETED')?._count?.id || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status Breakdown</h3>
            <div className="space-y-4">
              {stats?.breakdown?.map((item: any) => {
                const percentage = stats.totalItems > 0 ? (item._count.id / stats.totalItems) * 100 : 0;
                return (
                  <div key={item.status}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{formatStatus(item.status)}</span>
                      <span className="text-gray-500">{item._count.id} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="mt-1 relative">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${percentage}%` }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getStatusColor(item.status)}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Media Type Distribution */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Media Type Distribution</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats?.breakdown?.reduce((acc: any, item: any) => {
                // Group by type instead of status for this section
                return acc;
              }, []) || []}
              
              {/* Placeholder for media type breakdown */}
              {['MOVIE', 'TV_SHOW', 'BOOK', 'GAME', 'PODCAST'].map((type) => {
                const count = stats?.breakdown?.filter((item: any) => 
                  // This would need to be adjusted based on actual data structure
                  item.type === type
                ).reduce((sum: number, item: any) => sum + item._count.id, 0) || 0;
                
                return (
                  <div key={type} className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">{getTypeIcon(type)}</div>
                    <div className="text-lg font-semibold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-500">{type.replace('_', ' ')}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Insights */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats?.breakdown?.find((item: any) => item.status === 'WATCHING')?._count?.id || 0}
              </div>
              <div className="text-sm text-blue-800">Currently Watching</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.breakdown?.find((item: any) => item.status === 'WANT_TO_WATCH')?._count?.id || 0}
              </div>
              <div className="text-sm text-yellow-800">Want to Watch</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {stats?.breakdown?.find((item: any) => item.status === 'ON_HOLD')?._count?.id || 0}
              </div>
              <div className="text-sm text-orange-800">On Hold</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {stats?.breakdown?.find((item: any) => item.status === 'DROPPED')?._count?.id || 0}
              </div>
              <div className="text-sm text-red-800">Dropped</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
