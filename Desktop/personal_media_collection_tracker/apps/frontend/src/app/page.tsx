'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { apiService, MediaItem } from '@/lib/api';
import { FilmIcon, ChartBarIcon, SparklesIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [recentMedia, setRecentMedia] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }
    
    fetchDashboardData();
  }, [isAuthenticated, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [mediaItems, statsData] = await Promise.all([
        apiService.getMediaItems().catch(() => []),
        apiService.getMediaStats().catch(() => null)
      ]);
      
      setRecentMedia(Array.isArray(mediaItems) ? mediaItems.slice(0, 6) : []);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setRecentMedia([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'WATCHING': return 'bg-blue-100 text-blue-800';
      case 'WANT_TO_WATCH': return 'bg-yellow-100 text-yellow-800';
      case 'ON_HOLD': return 'bg-orange-100 text-orange-800';
      case 'DROPPED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-sm text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || user?.email}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your media collection and activity.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FilmIcon className="h-6 w-6 text-indigo-600" />
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
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
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

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">▶</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Watching</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.breakdown?.find((item: any) => item.status === 'WATCHING')?._count?.id || 0}
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
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">⭐</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Rating</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.averageRating ? `${stats.averageRating}/10` : 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/media"
          className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100">
              <FilmIcon className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              <span className="absolute inset-0" aria-hidden="true" />
              Manage Collection
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Add, edit, and organize your media items.
            </p>
          </div>
        </Link>

        <Link
          href="/status"
          className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 group-hover:bg-green-100">
              <ChartBarIcon className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              <span className="absolute inset-0" aria-hidden="true" />
              Track Progress
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              View your collection statistics and progress.
            </p>
          </div>
        </Link>

        <Link
          href="/ai"
          className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 group-hover:bg-purple-100">
              <SparklesIcon className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              <span className="absolute inset-0" aria-hidden="true" />
              AI Recommendations
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get personalized recommendations based on your taste.
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Media */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Additions</h3>
            <Link
              href="/media"
              className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
            >
              View all
            </Link>
          </div>
          
          {recentMedia.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentMedia.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {formatStatus(item.status)}
                        </span>
                      </div>
                      {item.rating && (
                        <div className="mt-2 text-xs text-gray-500">
                          Rating: {item.rating}/10
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No media items yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first media item.</p>
              <div className="mt-6">
                <Link
                  href="/media"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Media Item
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
