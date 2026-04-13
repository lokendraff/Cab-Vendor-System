import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronRight, CreditCard, FileText, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import { formatDateTime } from '../../utils/helpers';

const TYPE_META = {
  ALERT: {
    icon: Shield,
    label: 'Alert',
    row: 'border-l-2 border-l-red-500/60',
    chip: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  SYSTEM: {
    icon: Bell,
    label: 'System',
    row: 'border-l-2 border-l-gold-500/50',
    chip: 'bg-gold-500/10 text-gold-400 border-gold-500/20',
  },
  DOCUMENT: {
    icon: FileText,
    label: 'Document',
    row: 'border-l-2 border-l-indigo-400/50',
    chip: 'bg-indigo-500/10 text-indigo-300 border-indigo-400/20',
  },
  PAYMENT: {
    icon: CreditCard,
    label: 'Payment',
    row: 'border-l-2 border-l-emerald-500/50',
    chip: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
};

const NotificationDropdown = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [markingId, setMarkingId] = useState(null);
  const rootRef = useRef(null);

  const unreadCount = items.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get(ENDPOINTS.NOTIFICATIONS.GET_MY);
      if (data.success && Array.isArray(data.data)) {
        setItems(data.data);
      }
    } catch {
      toast.error('Could not load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const prev = prevPathRef.current;
    if (prev === '/notifications' && location.pathname !== '/notifications') {
      fetchNotifications();
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname, fetchNotifications]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleMarkRead = async (e, id, alreadyRead) => {
    e.stopPropagation();
    if (alreadyRead) return;
    setMarkingId(id);
    try {
      const { data } = await API.put(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
      if (data.success && data.data) {
        setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      }
    } catch {
      toast.error('Could not update notification');
    } finally {
      setMarkingId(null);
    }
  };

  const preview = items.slice(0, 6);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`relative p-2.5 rounded-xl transition-all duration-200 ${
          open
            ? 'text-gold-400 bg-white/[0.06] border border-gold-500/25 golden-glow'
            : 'text-gray-500 hover:text-gold-400 hover:bg-white/[0.03] border border-transparent'
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 min-w-[6px] h-1.5 px-0.5 flex items-center justify-center rounded-full bg-gold-400 shadow-[0_0_6px_rgba(212,168,83,0.6)]" />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-3 w-[min(100vw-1.5rem,22rem)] rounded-2xl bg-space-900 border border-gold-500/20 shadow-golden-lg z-[9999] overflow-hidden"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between bg-space-900">
            <div>
              <p className="text-xs font-display font-bold tracking-[0.2em] text-gold-500 uppercase">
                Signals
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
            {loading && <Loader2 className="w-4 h-4 text-gold-500/80 animate-spin" />}
          </div>

          <div className="max-h-[min(60vh,20rem)] overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="py-12 flex justify-center text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin text-gold-500/60" />
              </div>
            ) : preview.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <p className="text-sm text-gray-400">No notifications yet</p>
                <p className="text-xs text-gray-600 mt-1">We’ll ping you when something matters.</p>
              </div>
            ) : (
              <ul className="divide-y divide-white/[0.04]">
                {preview.map((n) => {
                  const meta = TYPE_META[n.type] || TYPE_META.SYSTEM;
                  const Icon = meta.icon;
                  const busy = markingId === n._id;
                  return (
                    <li key={n._id}>
                      <button
                        type="button"
                        onClick={(e) => handleMarkRead(e, n._id, n.isRead)}
                        disabled={busy}
                        className={`w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-white/[0.03] ${meta.row} ${
                          !n.isRead ? 'bg-gold-500/[0.04]' : ''
                        }`}
                      >
                        <div
                          className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${meta.chip}`}
                        >
                          {busy ? (
                            <Loader2 className="w-4 h-4 animate-spin opacity-80" />
                          ) : (
                            <Icon size={16} strokeWidth={2} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-semibold truncate ${
                                n.isRead ? 'text-gray-400' : 'text-gray-100'
                              }`}
                            >
                              {n.title}
                            </p>
                            {!n.isRead && (
                              <span className="shrink-0 w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(212,168,83,0.45)] mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-gray-600 mt-1.5 font-medium tracking-wide">
                            {formatDateTime(n.createdAt)}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="p-3 border-t border-white/[0.06] bg-space-950">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1 w-full py-2.5 rounded-xl text-xs font-bold tracking-wide text-gold-400 border border-gold-500/25 hover:bg-gold-500/10 hover:border-gold-500/35 transition-all golden-glow"
            >
              View command log
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
