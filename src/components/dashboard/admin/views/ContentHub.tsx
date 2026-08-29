import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Star,
  Download,
  Trash2,
  Edit2,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';

export const ContentHub: React.FC = () => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Status: All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Tech' | 'Business' | 'Non-Tech'>('Tech');
  const [newDescription, setNewDescription] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchRoadmaps = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getContentRoadmaps({
        category: selectedCategoryFilter,
        status: selectedStatusFilter,
      });
      if (data) {
        setRoadmaps(data);
      }
    } catch (error) {
      console.error('Failed to load roadmaps:', error);
      triggerToast('⚠️ Unable to fetch roadmaps from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [selectedCategoryFilter, selectedStatusFilter]);

  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await adminApi.createContentRoadmap({
        title: newTitle.trim(),
        category: newCategory,
        description: newDescription.trim(),
        status: 'Published',
      });
      triggerToast(`🎉 Learning Roadmap "${newTitle.trim()}" created and published!`);
      setShowAddModal(false);
      setNewTitle('');
      setNewDescription('');
      fetchRoadmaps();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to create roadmap');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete roadmap "${title}"?`)) return;
    try {
      await adminApi.deleteContentRoadmap(id);
      triggerToast('🗑️ Roadmap removed.');
      fetchRoadmaps();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to delete roadmap');
    }
  };

  const filteredRoadmaps = roadmaps.filter((r) => {
    const matchesSearch =
      !searchQuery.trim() ||
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans text-slate-800 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Content Hub & Learning Tracks</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Curate learning roadmaps, skills assessments, and placement prep modules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Roadmap Track</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-purple-100/70 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search roadmaps by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All Categories">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Business">Business</option>
            <option value="Non-Tech">Non-Tech</option>
          </select>
        </div>

        <span className="text-xs font-bold text-slate-400">{filteredRoadmaps.length} Tracks Available</span>
      </div>

      {/* Roadmap Cards Grid */}
      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#6D28D9] animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading learning tracks from database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.length === 0 ? (
            <div className="col-span-full p-12 bg-white rounded-2xl border border-purple-100/70 text-center text-slate-400 font-bold text-xs">
              No roadmaps found in database. Click "New Roadmap Track" to create one.
            </div>
          ) : (
            filteredRoadmaps.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-6 border border-purple-100/70 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 leading-tight pt-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.description || 'Comprehensive curriculum module for candidate training.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-bold">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>{item.enrollments || 0} enrolled</span>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    title="Delete Roadmap"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Roadmap Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-purple-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-bold text-slate-900">Create New Career Track</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoadmap} className="space-y-4 text-xs font-bold text-slate-700">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-slate-500">
                  Track Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full-Stack Cloud Engineering 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-slate-500">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30 cursor-pointer"
                >
                  <option value="Tech">Tech</option>
                  <option value="Business">Business</option>
                  <option value="Non-Tech">Non-Tech</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief curriculum synopsis..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  Publish Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentHub;
