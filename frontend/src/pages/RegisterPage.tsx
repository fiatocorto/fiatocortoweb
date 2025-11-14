import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'autenticazione Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.acceptTerms) {
      setError('Devi accettare i termini e condizioni per registrarti');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }

    if (formData.password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }

    setLoading(true);

    try {
      await register(formData.firstName, formData.lastName, formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Errore nella registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        
        <h1 className="font-title text-4xl font-bold">Registrati</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nome</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Cognome</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Conferma Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                required
              />
              <span className="text-sm text-muted">
                Accetto i{' '}
                <Link to="/terms" className="text-accent hover:underline">
                  termini e condizioni
                </Link>
              </span>
            </label>
          </div>

          <button type="submit" disabled={loading || googleLoading} className="btn-primary w-full mb-4">
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted">oppure</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-muted rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <span>Caricamento...</span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Accedi con Google</span>
              </>
            )}
          </button>

          <p className="text-center text-sm text-muted mt-4">
            Hai già un account?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Accedi
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

