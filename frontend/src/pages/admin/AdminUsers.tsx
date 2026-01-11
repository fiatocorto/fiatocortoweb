import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/Modal';

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string;
  email: string;
  registrationMethod: 'Google' | 'Email/Password' | 'Unknown';
  role: 'ADMIN' | 'CUSTOMER';
  createdAt: string;
  bookingsCount: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/admins/users');
      setUsers(response.data.users);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.error || 'Errore nel caricamento utenti');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Sei sicuro di voler eliminare l'utente "${userName}"? Questa azione non può essere annullata.`)) {
      return;
    }

    try {
      setDeletingUserId(userId);
      await api.delete(`/api/admins/users/${userId}`);
      // Refresh users list
      await fetchUsers();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Errore nell\'eliminazione utente';
      alert(errorMessage);
      console.error('Error deleting user:', err);
    } finally {
      setDeletingUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadge = (role: string) => {
    return role === 'ADMIN' ? (
      <span className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
        Admin
      </span>
    ) : (
      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
        Cliente
      </span>
    );
  };

  const getRegistrationMethodBadge = (method: string) => {
    if (method === 'Google') {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          Google
        </span>
      );
    } else if (method === 'Email/Password') {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          Email/Password
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
          Sconosciuto
        </span>
      );
    }
  };

  const createButton = (
    <button onClick={() => setShowCreateModal(true)} className="btn-primary">
      <Plus className="w-5 h-5 inline mr-2" />
      Nuovo utente
    </button>
  );

  return (
    <AdminLayout title="Gestione Utenti" actions={createButton}>
      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-muted">Caricamento utenti...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-muted">Nessun utente trovato</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cognome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Registrazione
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Data Registrazione
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ruolo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Prenotazioni
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.firstName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.lastName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRegistrationMethodBadge(user.registrationMethod)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                      {user.bookingsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={deletingUserId === user.id || user.bookingsCount > 0}
                        className="inline-flex items-center px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          user.bookingsCount > 0
                            ? `Impossibile eliminare: l'utente ha ${user.bookingsCount} prenotazione/i`
                            : 'Elimina utente'
                        }
                      >
                        {deletingUserId === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crea Nuovo Utente"
      >
        <CreateUserForm
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      </Modal>
    </AdminLayout>
  );
}

function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'CUSTOMER' as 'ADMIN' | 'CUSTOMER',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/api/admins', formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore nella creazione utente');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Nome *</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-muted rounded-lg"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Cognome *</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-muted rounded-lg"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email *</label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-muted rounded-lg"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password *</label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-muted rounded-lg"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          minLength={6}
        />
        <p className="text-xs text-muted mt-1">Minimo 6 caratteri</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Ruolo *</label>
        <select
          className="w-full px-4 py-2 border border-muted rounded-lg"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'CUSTOMER' })}
          required
        >
          <option value="CUSTOMER">Cliente</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onSuccess} className="btn-outline">
          Annulla
        </button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Creazione...' : 'Crea Utente'}
        </button>
      </div>
    </form>
  );
}
