import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import api from '../../utils/api';
import Modal from '../Modal';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    if (showModal) {
      fetchNotifications();
    }
  }, [showModal]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/api/notifications/unread/count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications?limit=20');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsSeen = async (id: string) => {
    try {
      await api.put(`/api/notifications/${id}/seen`);
      fetchUnreadCount();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as seen:', error);
    }
  };

  const markAllAsSeen = async () => {
    try {
      await api.put('/api/notifications/seen/all');
      fetchUnreadCount();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as seen:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="relative w-full flex items-center justify-center px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Notifiche"
        size="lg"
      >
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <p className="text-muted text-center py-8">Nessuna notifica</p>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={markAllAsSeen}
                  className="text-sm text-accent hover:underline"
                >
                  Segna tutte come lette
                </button>
              </div>
              {notifications.map((notification) => {
                const payload = JSON.parse(notification.payload || '{}');
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      !notification.seen ? 'bg-accent/10 border-accent' : 'bg-white border-muted'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{notification.type}</p>
                        <p className="text-sm text-muted mt-1">
                          {payload.message || JSON.stringify(payload)}
                        </p>
                        <p className="text-xs text-muted mt-2">
                          {new Date(notification.createdAt).toLocaleString('it-IT')}
                        </p>
                      </div>
                      {!notification.seen && (
                        <button
                          onClick={() => markAsSeen(notification.id)}
                          className="text-xs text-accent hover:underline ml-4"
                        >
                          Segna letta
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

