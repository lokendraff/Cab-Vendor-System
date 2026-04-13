import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CreditCard, FileText, Loader2, Shield, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Button from '../../components/ui/Button';
import { formatDateTime } from '../../utils/helpers';

const TYPE_META = {
  ALERT: {
    icon: Shield,
    label: 'Alert',
    chip: 'bg-red-500/10 text-red-400 border-red-500/20',
    accent: 'from-red-500/20 to-transparent',
  },
  SYSTEM: {
    icon: Bell,
    label: 'System',
    chip: 'bg-gold-500/10 text-gold-400 border-gold-500/20',
    accent: 'from-gold-500/20 to-transparent',
  },
  DOCUMENT: {
    icon: FileText,
    label: 'Document',
    chip: 'bg-indigo-500/10 text-indigo-300 border-indigo-400/20',
    accent: 'from-indigo-500/15 to-transparent',
  },
  PAYMENT: {
    icon: CreditCard,
    label: 'Payment',
    chip: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    accent: 'from-emerald-500/15 to-transparent',
  },
};

const NotificationsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [filter, setFilter] = useState('all');

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

  const unreadCount = useMemo(() => items.filter((n) => !n.isRead).length, [items]);

  const filtered = useMemo(() => {
    if (filter === 'unread') return items.filter((n) => !n.isRead);
    return items;
  }, [items, filter]);

  const handleMarkRead = async (id, alreadyRead) => {
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

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    setMarkingAll(true);
    try {
      const { data } = await API.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
      if (data.success) {
        toast.success(data.message || 'All marked as read');
        setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch {
      toast.error('Could not mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const TABS = [
    { key: 'all', label: 'All', count: items.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
  ];

  return (
    <div className="p-6 md:p-10 relative min-h-[calc(100vh-4rem)]">
      <div className="absolute top-[-20%] right-[5%] w-[520px] h-[520px] bg-gold-500/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-25%] left-[0%] w-[480px] h-[480px] bg-indigo-900/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full mb-4">
            <Sparkles className="text-gold-400" size={14} />
            <span className="text-[10px] font-bold text-gold-500 uppercase tracking-[0.25em]">
              Command log
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">
            Fleet alerts, billing, documents, and system messages — unified in one stream.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            onClick={fetchNotifications}
            disabled={loading}
            loading={loading}
            className="!py-2.5 !px-4 !text-xs"
          >
            Refresh
          </Button>
          <Button
            variant="gold"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || markingAll}
            loading={markingAll}
            className="!py-2.5 !px-5 !text-xs"
          >
            Mark all as read
          </Button>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative z-10 glass-panel-strong rounded-2xl border border-gold-500/15 overflow-hidden golden-glow"
      >
        <div className="flex flex-wrap gap-2 p-4 border-b border-white/[0.06] bg-white/[0.02]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                filter === tab.key
                  ? 'bg-gold-500/15 text-gold-400 border-gold-500/30 golden-glow'
                  : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/[0.04]'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-[10px] opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {loading && items.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500/70" />
            <span className="text-sm">Syncing signals…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 px-6 text-center">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 items-center justify-center mb-4">
              <Bell className="text-gold-500/60" size={24} />
            </div>
            <p className="text-gray-400 font-medium">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
            <p className="text-xs text-gray-600 mt-2 max-w-sm mx-auto">
              When document expiry, payments, or admin actions occur, they will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.04]">
            {filtered.map((n, idx) => {
              const meta = TYPE_META[n.type] || TYPE_META.SYSTEM;
              const Icon = meta.icon;
              const busy = markingId === n._id;
              return (
                <motion.li
                  key={n._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                >
                  <button
                    type="button"
                    onClick={() => handleMarkRead(n._id, n.isRead)}
                    disabled={busy}
                    className={`w-full text-left px-5 py-4 flex gap-4 transition-colors hover:bg-white/[0.03] group ${
                      !n.isRead ? 'bg-gold-500/[0.03]' : ''
                    }`}
                  >
                    <div
                      className={`relative shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${meta.chip} overflow-hidden`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${meta.accent} opacity-80 pointer-events-none`}
                      />
                      {busy ? (
                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                      ) : (
                        <Icon size={20} strokeWidth={2} className="relative z-10" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2 gap-y-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${meta.chip}`}
                        >
                          {meta.label}
                        </span>
                        {!n.isRead && (
                          <span className="text-[10px] font-bold text-gold-500 uppercase tracking-wider">
                            New
                          </span>
                        )}
                      </div>
                      <h2
                        className={`text-base font-semibold mt-2 ${
                          n.isRead ? 'text-gray-400' : 'text-white group-hover:text-gold-100'
                        }`}
                      >
                        {n.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                      <p className="text-[11px] text-gray-600 mt-3 font-medium">
                        {formatDateTime(n.createdAt)}
                      </p>
                    </div>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
