import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import type { ServicePricing, ReferenceCountry, ReferenceService } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminServicePricing() {
  const [pricings, setPricings] = useState<ServicePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPricing, setEditingPricing] = useState<ServicePricing | null>(null);
  const [searchService, setSearchService] = useState('');
  const [searchCountry, setSearchCountry] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Liste des pays et services disponibles
  const [countries, setCountries] = useState<ReferenceCountry[]>([]);
  const [services, setServices] = useState<ReferenceService[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    serviceCode: '',
    countryCode: '',
    price: '',
    currency: 'USD',
    costPrice: '',
    margin: '',
    isActive: true,
  });

  useEffect(() => {
    loadPricings();
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);
      const [countriesData, servicesData] = await Promise.all([
        adminService.getAvailableCountries(),
        adminService.getAvailableServices(),
      ]);
      setCountries(countriesData || []);
      setServices(servicesData || []);
    } catch (error) {
      console.error('Erreur chargement options:', error);
      setError('Impossible de charger les pays et services disponibles');
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadPricings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getServicePricings({ limit: 500 });
      setPricings(response.pricings || []);
      setError(null);
    } catch (error) {
      console.error('Erreur chargement tarifs:', error);
      setError('Impossible de charger les tarifs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data = {
        serviceCode: formData.serviceCode,
        countryCode: formData.countryCode,
        price: parseFloat(formData.price),
        currency: formData.currency,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        margin: formData.margin ? parseFloat(formData.margin) : undefined,
        isActive: formData.isActive,
      };

      if (editingPricing) {
        await adminService.updateServicePricing(editingPricing.id, data);
        setSuccessMessage('Tarif mis à jour avec succès');
      } else {
        await adminService.createServicePricing(data);
        setSuccessMessage('Tarif créé avec succès');
      }

      setShowModal(false);
      setEditingPricing(null);
      resetForm();
      await loadPricings();

      // Masquer le message après 3 secondes
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: unknown) {
      console.error('Erreur sauvegarde:', error);
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : 'Erreur lors de la sauvegarde';
      setError(errorMessage);
    }
  };

  const handleEdit = (pricing: ServicePricing) => {
    setEditingPricing(pricing);
    setFormData({
      serviceCode: pricing.serviceCode,
      countryCode: pricing.countryCode,
      price: pricing.price.toString(),
      currency: pricing.currency,
      costPrice: pricing.costPrice?.toString() || '',
      margin: pricing.margin?.toString() || '',
      isActive: pricing.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce tarif ?')) return;
    try {
      await adminService.deleteServicePricing(id);
      loadPricings();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async (pricing: ServicePricing) => {
    try {
      await adminService.updateServicePricing(pricing.id, { isActive: !pricing.isActive });
      loadPricings();
    } catch (error) {
      console.error('Erreur toggle:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      serviceCode: '',
      countryCode: '',
      price: '',
      currency: 'USD',
      costPrice: '',
      margin: '',
      isActive: true,
    });
  };

  // Helper pour obtenir le nom à partir du code
  const getServiceName = (code: string): string => {
    const service = services.find(s => s.code === code);
    return service?.name || code;
  };

  const getCountryName = (code: string): string => {
    const country = countries.find(c => c.code === code);
    return country?.name || code;
  };

  const getCountryFlag = (code: string): string | undefined => {
    const country = countries.find(c => c.code === code);
    return country?.flag;
  };

  const filteredPricings = pricings.filter(p => {
    const matchService = !searchService || p.serviceCode === searchService;
    const matchCountry = !searchCountry || p.countryCode === searchCountry;
    return matchService && matchCountry;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">X</button>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tarification des services</h2>
          <p className="text-gray-600">
            {pricings.length} tarifs configurés
            {loadingOptions && ' | Chargement des options...'}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingPricing(null); setShowModal(true); }}
          disabled={loadingOptions || services.length === 0 || countries.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>+</span>
          <span>Nouveau tarif</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select
              value={searchService}
              onChange={(e) => setSearchService(e.target.value)}
              disabled={loadingOptions}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">{loadingOptions ? 'Chargement...' : 'Tous les services'}</option>
              {services.map((service) => (
                <option key={service.code} value={service.code}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <select
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
              disabled={loadingOptions}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">{loadingOptions ? 'Chargement...' : 'Tous les pays'}</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pays</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Coût</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Marge</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPricings.map((pricing) => (
                <tr key={pricing.id} className={`hover:bg-gray-50 ${!pricing.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-medium text-gray-900">{getServiceName(pricing.serviceCode)}</span>
                      <span className="text-xs text-gray-500 ml-1">({pricing.serviceCode})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getCountryFlag(pricing.countryCode) && (
                        <img
                          src={getCountryFlag(pricing.countryCode)}
                          alt={pricing.countryCode}
                          className="w-5 h-4 object-cover rounded-sm"
                        />
                      )}
                      <div>
                        <span className="text-gray-900">{getCountryName(pricing.countryCode)}</span>
                        <span className="text-xs text-gray-500 ml-1">({pricing.countryCode})</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-green-600">
                      {pricing.price} {pricing.currency}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {pricing.costPrice ? `${pricing.costPrice} ${pricing.currency}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {pricing.margin ? `${pricing.margin}%` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(pricing)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pricing.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {pricing.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(pricing)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(pricing.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPricings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun tarif trouvé
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingPricing ? 'Modifier le tarif' : 'Nouveau tarif'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
                  <select
                    value={formData.serviceCode}
                    onChange={(e) => setFormData({ ...formData, serviceCode: e.target.value })}
                    required
                    disabled={!!editingPricing || loadingOptions}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Sélectionner un service</option>
                    {services.map((service) => (
                      <option key={service.code} value={service.code}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    required
                    disabled={!!editingPricing || loadingOptions}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Sélectionner un pays</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1.50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="XOF">XOF (FCFA)</option>
                    <option value="XAF">XAF (FCFA)</option>
                    <option value="NGN">NGN (₦)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix d'achat</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marge (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.margin}
                    onChange={(e) => setFormData({ ...formData, margin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Actif</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingPricing(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPricing ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
