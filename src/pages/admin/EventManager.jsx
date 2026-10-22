import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, MapPin, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmModal from '../../components/admin/ConfirmModal';

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  const loadEvents = async () => {
    try {
      const res = await authFetch('/api/admin/events');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setEvents(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateNew = () => {
    setEditingEvent({
      id: null,
      title: '',
      description: '',
      date: 'November 2025',
      location: 'Jaipur Exhibition & Convention Centre (JECC)',
      image: '/images/hero/slide-1.jpg',
      external_link: '',
      display_order: events.length + 1,
      status: 'published'
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingEvent.title || !editingEvent.date) {
      setMessage({ type: 'error', text: 'Title and Date are required.' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const isNew = !editingEvent.id;
      const url = isNew ? '/api/admin/events' : `/api/admin/events/${editingEvent.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await authFetch(url, { method, body: editingEvent });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save event');
      }

      setMessage({ type: 'success', text: `Event "${editingEvent.title}" saved successfully!` });
      setEditingEvent(null);
      loadEvents();
      if (refreshCMS) await refreshCMS();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    try {
      const res = await authFetch(`/api/admin/events/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Event deleted successfully.' });
        loadEvents();
        if (refreshCMS) await refreshCMS();
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to delete event' });
    } finally {
      setDeleteId(null);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Exhibitions & Events ({events.length} Events)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage industry stone expos, trade summits, and exhibition schedules.
          </p>
        </div>

        {!editingEvent && (
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form View */}
      {editingEvent ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
            <h2 className="text-base font-bold text-slate-900">
              {editingEvent.id ? `Edit Event: ${editingEvent.title}` : 'Add New Event'}
            </h2>
            <button
              onClick={() => setEditingEvent(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ImageUploader
                  label="Event Banner / Photo"
                  value={editingEvent.image}
                  onChange={(url) => setEditingEvent({ ...editingEvent, image: url })}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    placeholder="e.g. Jaipur International StoneMart"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Event Date / Timeline
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEvent.date}
                      onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                      placeholder="e.g. November 2025"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Location / Venue
                    </label>
                    <input
                      type="text"
                      value={editingEvent.location || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      placeholder="e.g. JECC, Sitapura, Jaipur"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    External Link / Registration URL
                  </label>
                  <input
                    type="url"
                    value={editingEvent.external_link || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, external_link: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={editingEvent.display_order}
                      onChange={(e) => setEditingEvent({ ...editingEvent, display_order: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      value={editingEvent.status}
                      onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Event Description
              </label>
              <textarea
                rows="3"
                value={editingEvent.description || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                placeholder="Details about our booth, stone slabs showcase, or speaker keynote..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Event</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Events Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div 
              key={ev.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                  <img
                    src={ev.image || '/images/hero/slide-1.jpg'}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/hero/slide-1.jpg'; }}
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    {ev.date} • {ev.status === 'published' ? '🟢 Published' : '⚪ Draft'}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-serif font-bold text-base text-slate-900 line-clamp-1">
                    {ev.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-[#0A4E9B] shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {ev.description}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">
                  Order: #{ev.display_order}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingEvent(ev)}
                    className="p-1.5 text-slate-600 hover:text-[#0A4E9B] hover:bg-white rounded-lg transition cursor-pointer"
                    title="Edit Event"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(ev.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg transition cursor-pointer"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message="Are you sure you want to remove this event schedule?"
        loading={isSaving}
      />

    </div>
  );
}
