'use client';

import { useState, useEffect } from 'react';
import { apiService, MediaItem, CreateMediaItem } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const mediaTypes = [
  { value: '', label: 'All Types' },
  { value: 'MOVIE', label: 'Movies' },
  { value: 'TV_SHOW', label: 'TV Shows' },
  { value: 'BOOK', label: 'Books' },
  { value: 'GAME', label: 'Games' },
  { value: 'PODCAST', label: 'Podcasts' },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'WANT_TO_WATCH', label: 'Want to Watch' },
  { value: 'WATCHING', label: 'Watching' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DROPPED', label: 'Dropped' },
  { value: 'ON_HOLD', label: 'On Hold' },
];

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMediaItems();
    }
  }, [isAuthenticated, selectedType, selectedStatus]);

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const items = await apiService.getMediaItems(selectedType, selectedStatus);
      setMediaItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Failed to fetch media items:', error);
      setMediaItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchMediaItems();
      return;
    }
    
    try {
      const results = await apiService.searchMedia(searchQuery);
      setMediaItems(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await apiService.deleteMediaItem(id);
      setMediaItems(mediaItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
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
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please sign in to access your media collection.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Media Collection</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your movies, TV shows, books, games, and podcasts.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Media
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {mediaTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading your media collection...</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{item.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.type.replace('_', ' ')}
                  </span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {formatStatus(item.status)}
                  </span>
                </div>

                {item.rating && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">Rating:</span>
                      <span className="ml-1 text-sm font-medium text-gray-900">{item.rating}/10</span>
                    </div>
                  </div>
                )}

                {item.notes && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.notes}</p>
                )}

                <p className="mt-2 text-xs text-gray-400">
                  Added {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {mediaItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No media items found. Add some to get started!</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <AddEditModal
          item={editingItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSave={fetchMediaItems}
        />
      )}
    </div>
  );
}

function AddEditModal({ 
  item, 
  onClose, 
  onSave 
}: { 
  item: MediaItem | null; 
  onClose: () => void; 
  onSave: () => void; 
}) {
  const [formData, setFormData] = useState<CreateMediaItem>({
    title: item?.title || '',
    type: item?.type || 'MOVIE',
    status: item?.status || 'WANT_TO_WATCH',
    rating: item?.rating || undefined,
    notes: item?.notes || '',
    coverUrl: item?.coverUrl || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (item) {
        await apiService.updateMediaItem(item.id, formData);
      } else {
        await apiService.createMediaItem(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save media item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {item ? 'Edit Media Item' : 'Add New Media Item'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="MOVIE">Movie</option>
              <option value="TV_SHOW">TV Show</option>
              <option value="BOOK">Book</option>
              <option value="GAME">Game</option>
              <option value="PODCAST">Podcast</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="WANT_TO_WATCH">Want to Watch</option>
              <option value="WATCHING">Watching</option>
              <option value="COMPLETED">Completed</option>
              <option value="DROPPED">Dropped</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rating (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.rating || ''}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value ? parseInt(e.target.value) : undefined })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
