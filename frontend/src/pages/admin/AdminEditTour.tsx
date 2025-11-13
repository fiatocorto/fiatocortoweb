import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { X, Type, DollarSign, Globe, Image, MapPin, Clock, Calendar, Users, Mountain, Camera, CheckCircle, XCircle, FileText, ArrowLeft } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { it } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

registerLocale('it', it);

export default function AdminEditTour() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState<any>(null);

  // Helper to format date for DatePicker
  const formatDateForInput = (date: string | Date | null | undefined): Date | null => {
    if (!date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }
    return new Date(date);
  };

  // Helper to get default end date (start date + duration)
  const getDefaultEndDate = (startDate: Date | null, durationValue: number, durationUnit: string): Date | null => {
    if (!startDate) return null;
    const start = new Date(startDate);
    if (durationUnit === 'ore') {
      // Per le ore, consideriamo comunque un giorno
      start.setDate(start.getDate() + 1);
    } else if (durationUnit === 'giorni') {
      start.setDate(start.getDate() + durationValue);
    }
    return start;
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAdult: 0,
    priceChild: 0,
    language: 'Italiano',
    itinerary: '',
    durationValue: 1,
    durationUnit: 'ore',
    coverImage: '',
    images: [] as string[],
    includes: [] as string[],
    excludes: [] as string[],
    terms: '',
    maxSeats: 20,
    difficulty: '',
    isMultiDay: false,
    dateStart: null as Date | null,
    dateEnd: null as Date | null,
    gallery: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{ [key: number]: boolean }>({});
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  const handleFileUpload = async (file: File, type: 'cover' | 'gallery' | 'image', index?: number): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/api/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Errore nel caricamento dell\'immagine');
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await handleFileUpload(file, 'cover');
      setFormData({ ...formData, coverImage: url });
    } catch (error) {
      alert('Errore nel caricamento dell\'immagine di copertina');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map(file => handleFileUpload(file, 'gallery'));
      const urls = await Promise.all(uploadPromises);
      const galleryString = urls.join(', ');
      setFormData({ ...formData, gallery: galleryString });
    } catch (error) {
      alert('Errore nel caricamento delle immagini della galleria');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImages({ ...uploadingImages, [index]: true });
    try {
      const url = await handleFileUpload(file, 'image', index);
      updateArrayItem('images', index, url);
    } catch (error) {
      alert('Errore nel caricamento dell\'immagine');
    } finally {
      setUploadingImages({ ...uploadingImages, [index]: false });
    }
  };

  const fetchTour = useCallback(async () => {
    if (!id) return;
    try {
      const response = await api.get(`/api/tours/${id}`);
      const fetchedTour = response.data.tour;
      setTour(fetchedTour);

      // Update form data when tour is loaded
      const defaultStartDate = formatDateForInput(fetchedTour?.dateStart);
      const defaultEndDate = fetchedTour?.dateEnd 
        ? formatDateForInput(fetchedTour.dateEnd) 
        : getDefaultEndDate(defaultStartDate, fetchedTour?.durationValue || 1, fetchedTour?.durationUnit || 'ore');

      const initialFormData = {
        title: fetchedTour?.title || '',
        description: fetchedTour?.description || '',
        priceAdult: fetchedTour?.priceAdult || 0,
        priceChild: fetchedTour?.priceChild || 0,
        language: fetchedTour?.language || 'Italiano',
        itinerary: fetchedTour?.itinerary || '',
        durationValue: fetchedTour?.durationValue || 1,
        durationUnit: fetchedTour?.durationUnit || 'ore',
        coverImage: fetchedTour?.coverImage || '',
        images: fetchedTour?.images ? (typeof fetchedTour.images === 'string' ? JSON.parse(fetchedTour.images) : fetchedTour.images) : [],
        includes: fetchedTour?.includes ? (typeof fetchedTour.includes === 'string' ? JSON.parse(fetchedTour.includes) : fetchedTour.includes) : [],
        excludes: fetchedTour?.excludes ? (typeof fetchedTour.excludes === 'string' ? JSON.parse(fetchedTour.excludes) : fetchedTour.excludes) : [],
        terms: fetchedTour?.terms || '',
        maxSeats: fetchedTour?.maxSeats || 20,
        difficulty: fetchedTour?.difficulty || '',
        isMultiDay: fetchedTour?.isMultiDay || false,
        dateStart: defaultStartDate,
        dateEnd: defaultEndDate,
        gallery: fetchedTour?.gallery || '',
      };
      
      setFormData(initialFormData);
      setOriginalData(JSON.parse(JSON.stringify(initialFormData)));
    } catch (error) {
      console.error('Failed to fetch tour:', error);
      alert('Errore nel caricamento del tour');
      navigate('/admin/tours');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      fetchTour();
    }
  }, [id, fetchTour]);

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8 text-center">
          <p className="text-muted">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8 text-center">
          <p className="text-muted">Tour non trovato</p>
          <Link to="/admin/tours" className="text-accent hover:text-accent/80 mt-4 inline-block">
            Torna alla lista tour
          </Link>
        </div>
      </div>
    );
  }

  const addArrayItem = (field: 'images' | 'includes' | 'excludes', value: string = '') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], value],
    });
  };

  const updateArrayItem = (field: 'images' | 'includes' | 'excludes', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const removeArrayItem = (field: 'images' | 'includes' | 'excludes', index: number) => {
    const newArray = formData[field].filter((_: any, i: number) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges()) return;
    
    setSubmitting(true);

    try {
      // Converti le Date in stringhe ISO per il backend
      const dataToSend = {
        ...formData,
        dateStart: formData.dateStart ? formData.dateStart.toISOString() : '',
        dateEnd: formData.dateEnd ? formData.dateEnd.toISOString() : '',
      };
      await api.put(`/api/tours/${id}`, dataToSend);
      // Aggiorna i dati originali con quelli salvati
      setOriginalData(JSON.parse(JSON.stringify(formData)));
      setShowUnsavedWarning(false);
    } catch (error) {
      alert('Errore nel salvataggio');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasChanges()) {
      e.preventDefault();
      setShowUnsavedWarning(true);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <div>
            <Link 
              to="/admin/tours" 
              onClick={handleBackClick}
              className="inline-flex items-center text-muted hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla lista
            </Link>
            {showUnsavedWarning && (
              <p className="text-sm text-red-600 mt-1 mb-4">Ci sono delle modifiche da salvare</p>
            )}
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-title text-4xl font-bold text-primary">Modifica Tour</h1>
              <p className="text-muted mt-2">Modifica le informazioni del tour</p>
            </div>
            <button 
              type="submit" 
              form="edit-tour-form"
              disabled={submitting || !hasChanges()} 
              className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </div>
        </div>

        <form id="edit-tour-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Informazioni Base */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-accent/10 rounded-lg mr-3">
                <Type className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-primary">Informazioni Base</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Titolo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Descrizione <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none resize-none"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Prezzi e Lingua */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-accent/10 rounded-lg mr-3">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-primary">Prezzi e Lingua</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Prezzo Adulto <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">€</span>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                    value={formData.priceAdult}
                    onChange={(e) =>
                      setFormData({ ...formData, priceAdult: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Prezzo Bambino
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">€</span>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                    value={formData.priceChild}
                    onChange={(e) =>
                      setFormData({ ...formData, priceChild: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Lingua <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Immagini */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-accent/10 rounded-lg mr-3">
                <Image className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-primary">Immagini</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Copertina <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                    id="cover-image-input"
                    disabled={uploadingCover}
                  />
                  <label
                    htmlFor="cover-image-input"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      uploadingCover
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-gray-300 hover:border-accent hover:bg-accent/5'
                    }`}
                  >
                    {uploadingCover ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mb-2"></div>
                        <span className="text-sm text-muted">Caricamento...</span>
                      </div>
                    ) : formData.coverImage ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={formData.coverImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center">
                          <span className="text-white opacity-0 hover:opacity-100 text-sm font-medium">
                            Clicca per cambiare
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Image className="w-8 h-8 text-muted mb-2" />
                        <span className="text-sm text-muted">Clicca per caricare un'immagine</span>
                        <span className="text-xs text-muted mt-1">JPG, PNG, GIF o WEBP (max 10MB)</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Galleria
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="hidden"
                    id="gallery-input"
                    disabled={uploadingGallery}
                  />
                  <label
                    htmlFor="gallery-input"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      uploadingGallery
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-gray-300 hover:border-accent hover:bg-accent/5'
                    }`}
                  >
                    {uploadingGallery ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mb-2"></div>
                        <span className="text-sm text-muted">Caricamento...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera className="w-8 h-8 text-muted mb-2" />
                        <span className="text-sm text-muted">Clicca per caricare più immagini</span>
                        <span className="text-xs text-muted mt-1">Puoi selezionare più file (max 10MB ciascuno)</span>
                      </div>
                    )}
                  </label>
                </div>
                {formData.gallery && (
                  <div className="mt-3 text-sm text-muted">
                    {formData.gallery.split(',').length} immagine/i caricate
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Itinerario */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-accent/10 rounded-lg mr-3">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-primary">Itinerario</h2>
            </div>
            
            <div>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none resize-none"
                rows={6}
                value={formData.itinerary}
                onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
                placeholder="Descrivi l'itinerario del tour..."
              />
            </div>
          </div>

          {/* Durata e Date */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-accent/10 rounded-lg mr-3">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-primary">Durata e Date</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Valore (Numero di giorni o ore) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                    value={formData.durationValue}
                    onChange={(e) =>
                      setFormData({ ...formData, durationValue: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Unità (ore o giorni) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                    value={formData.durationUnit}
                    onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                    placeholder="ore, giorni..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Data Inizio <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none z-10" />
                    <DatePicker
                      selected={formData.dateStart}
                      onChange={(date: Date | null) => {
                        setFormData({ ...formData, dateStart: date });
                        // Aggiorna anche la data fine se necessario
                        if (date && formData.durationValue && formData.durationUnit) {
                          const endDate = getDefaultEndDate(date, formData.durationValue, formData.durationUnit);
                          setFormData(prev => ({ ...prev, dateStart: date, dateEnd: endDate }));
                        } else {
                          setFormData(prev => ({ ...prev, dateStart: date }));
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      locale="it"
                      calendarStartDay={1}
                      customInput={
                        <input
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none cursor-pointer text-primary"
                          style={{ fontSize: '16px' }}
                        />
                      }
                      popperClassName="z-[9999]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Data Fine <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none z-10" />
                    <DatePicker
                      selected={formData.dateEnd}
                      onChange={(date: Date | null) => setFormData({ ...formData, dateEnd: date })}
                      dateFormat="dd/MM/yyyy"
                      locale="it"
                      calendarStartDay={1}
                      customInput={
                        <input
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none cursor-pointer text-primary"
                          style={{ fontSize: '16px' }}
                        />
                      }
                      popperClassName="z-[9999]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Capacità e Difficoltà */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-accent/10 rounded-lg mr-3">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-primary">Capacità e Difficoltà</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Posti Massimi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="number"
                    min="1"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                    value={formData.maxSeats}
                    onChange={(e) => setFormData({ ...formData, maxSeats: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Difficoltà <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mountain className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none appearance-none bg-white"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="">Seleziona difficoltà</option>
                    <option value="Facile">Facile</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>
              </div>
            </div>
          </div>


          {/* Include e Exclude */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-accent/10 rounded-lg mr-3">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-primary">Cosa Include e Non Include</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-3">
                  <CheckCircle className="w-4 h-4 inline mr-2 text-green-600" />
                  Cosa Include
                </label>
                {formData.includes.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => addArrayItem('includes')}
                    className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-muted hover:border-green-500 hover:text-green-600 transition-colors"
                  >
                    + Aggiungi elemento
                  </button>
                ) : (
                  <div className="space-y-3">
                    {formData.includes.map((item: string, index: number) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                          value={item}
                          onChange={(e) => updateArrayItem('includes', index, e.target.value)}
                          placeholder="Es: Guida esperta, Pranzo al sacco..."
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('includes', index)}
                          className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('includes')}
                      className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-muted hover:border-green-500 hover:text-green-600 transition-colors"
                    >
                      + Aggiungi elemento
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3">
                  <XCircle className="w-4 h-4 inline mr-2 text-red-600" />
                  Cosa Non Include
                </label>
                {formData.excludes.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => addArrayItem('excludes')}
                    className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-muted hover:border-red-500 hover:text-red-600 transition-colors"
                  >
                    + Aggiungi elemento
                  </button>
                ) : (
                  <div className="space-y-3">
                    {formData.excludes.map((item: string, index: number) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                          value={item}
                          onChange={(e) => updateArrayItem('excludes', index, e.target.value)}
                          placeholder="Es: Bevande, Equipaggiamento personale..."
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('excludes', index)}
                          className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('excludes')}
                      className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-muted hover:border-red-500 hover:text-red-600 transition-colors"
                    >
                      + Aggiungi elemento
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Termini e Condizioni */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-accent/10 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-primary">Termini e Condizioni</h2>
            </div>
            
            <div>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none resize-none"
                rows={5}
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                placeholder="Inserisci i termini e condizioni del tour..."
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

