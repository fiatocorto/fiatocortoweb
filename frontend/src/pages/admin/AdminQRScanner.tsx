import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Keyboard } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminQRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [manualToken, setManualToken] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!codeReader.current || !videoRef.current) return;

    setScanning(true);
    setError('');
    setResult(null);

    try {
      const devices = await codeReader.current.listVideoInputDevices();
      const selectedDevice = devices[0]?.deviceId;

      codeReader.current.decodeFromVideoDevice(
        selectedDevice,
        videoRef.current,
        (result, err) => {
          if (result) {
            verifyQRCode(result.getText());
            stopScanning();
          }
          if (err && err.name !== 'NotFoundException') {
            setError('Errore nella scansione');
          }
        }
      );
    } catch (err) {
      setError('Impossibile accedere alla camera. Assicurati di avere i permessi.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setScanning(false);
  };

  const verifyQRCode = async (token: string) => {
    try {
      const response = await api.post('/api/qrcode/verify', { token });
      setResult(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'QR Code non valido');
      setResult(null);
    }
  };

  const handleManualSubmit = () => {
    if (manualToken.trim()) {
      verifyQRCode(manualToken.trim());
    }
  };

  return (
    <AdminLayout title="QR Code Scanner">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-title text-2xl font-bold mb-4">Scanner Camera</h2>
            <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{ display: scanning ? 'block' : 'none' }}
              />
              {!scanning && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <Camera className="w-16 h-16 opacity-50" />
                </div>
              )}
            </div>
            {!scanning ? (
              <button onClick={startScanning} className="btn-primary w-full">
                <Camera className="w-5 h-5 inline mr-2" />
                Avvia Scanner
              </button>
            ) : (
              <button onClick={stopScanning} className="btn-secondary w-full">
                Ferma Scanner
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-title text-2xl font-bold mb-4">Inserimento Manuale</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Token QR Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Incolla o digita il token"
                />
              </div>
              <button onClick={handleManualSubmit} className="btn-primary w-full">
                <Keyboard className="w-5 h-5 inline mr-2" />
                Verifica Token
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {result && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 mr-2" />
              <h3 className="font-bold text-lg">Prenotazione Verificata!</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Cliente:</strong> {result.booking.user.name} ({result.booking.user.email})
              </p>
              <p>
                <strong>Tour:</strong> {result.booking.tour?.title || result.booking.tour?.tour?.title || 'Tour'}
              </p>
              <p>
                <strong>Data:</strong>{' '}
                {result.booking.tour?.dateStart && new Date(result.booking.tour.dateStart).toLocaleString('it-IT')}
              </p>
              <p>
                <strong>Partecipanti:</strong> {result.booking.adults} adulti
                {result.booking.children > 0 && `, ${result.booking.children} bambini`}
              </p>
              <p>
                <strong>Totale:</strong> €{result.booking.totalPrice.toFixed(2)}
              </p>
              <p>
                <strong>Stato:</strong> {result.booking.paymentStatus}
              </p>
              {result.booking.checkedIn && (
                <p className="text-green-700 font-medium">✓ Check-in completato</p>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg">
          <p className="text-sm">
            <strong>Nota:</strong> Per utilizzare lo scanner QR con la camera, è necessario
            accedere tramite HTTPS o localhost. In produzione, assicurati di avere un certificato
            SSL valido.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

