import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/Modal';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Note: Backend doesn't have users list endpoint yet
    // This is a placeholder
    setLoading(false);
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-title text-4xl font-bold">Gestione Utenti</h1>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <Plus className="w-5 h-5 inline mr-2" />
            Crea Admin
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-muted">
            Funzionalità in sviluppo. Qui potrai gestire gli utenti e creare nuovi admin.
          </p>
        </div>

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Crea Nuovo Admin"
        >
          <CreateAdminForm
            onSuccess={() => {
              setShowCreateModal(false);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}

function CreateAdminForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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
      setError(err.response?.data?.error || 'Errore nella creazione admin');
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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onSuccess} className="btn-outline">
          Annulla
        </button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Creazione...' : 'Crea Admin'}
        </button>
      </div>
    </form>
  );
}

