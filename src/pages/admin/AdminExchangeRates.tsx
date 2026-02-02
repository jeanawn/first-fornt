import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import type { ExchangeRate } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

const COMMON_CURRENCIES = [
  { code: 'USD', name: 'Dollar US', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'CFA' },
  { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'CFA' },
  { code: 'NGN', name: 'Naira', symbol: '₦' },
  { code: 'GHS', name: 'Cedi', symbol: '₵' },
  { code: 'KES', name: 'Shilling Kenyan', symbol: 'KSh' },
  { code: 'ZAR', name: 'Rand', symbol: 'R' },
  { code: 'MAD', name: 'Dirham', symbol: 'DH' },
  { code: 'GBP', name: 'Livre Sterling', symbol: '£' },
];

export default function AdminExchangeRates() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState<ExchangeRate | null>(null);
  const [showConverter, setShowConverter] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fromCurrency: 'USD',
    toCurrency: 'XOF',
    rate: '',
    isActive: true,
  });

  // Converter state
  const [converterAmount, setConverterAmount] = useState('100');
  const [converterFrom, setConverterFrom] = useState('USD');
  const [converterTo, setConverterTo] = useState('XOF');
  const [convertedResult, setConvertedResult] = useState<number | null>(null);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      const data = await adminService.getExchangeRates(true);
      setRates(data);
    } catch (error) {
      console.error('Erreur chargement taux:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        fromCurrency: formData.fromCurrency,
        toCurrency: formData.toCurrency,
        rate: parseFloat(formData.rate),
        isActive: formData.isActive,
      };

      if (editingRate) {
        await adminService.updateExchangeRate(editingRate.id, {
          rate: data.rate,
          isActive: data.isActive,
        });
      } else {
        await adminService.createExchangeRate(data);
      }

      setShowModal(false);
      setEditingRate(null);
      resetForm();
      loadRates();
    } catch (error: unknown) {
      console.error('Erreur sauvegarde:', error);
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Erreur lors de la sauvegarde';
      alert(errorMessage);
    }
  };

  const handleEdit = (rate: ExchangeRate) => {
    setEditingRate(rate);
    setFormData({
      fromCurrency: rate.fromCurrency,
      toCurrency: rate.toCurrency,
      rate: rate.rate.toString(),
      isActive: rate.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce taux de change ?')) return;
    try {
      await adminService.deleteExchangeRate(id);
      loadRates();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async (rate: ExchangeRate) => {
    try {
      await adminService.updateExchangeRate(rate.id, { isActive: !rate.isActive });
      loadRates();
    } catch (error) {
      console.error('Erreur toggle:', error);
    }
  };

  const handleConvert = async () => {
    try {
      const result = await adminService.convertCurrency(
        parseFloat(converterAmount),
        converterFrom,
        converterTo
      );
      setConvertedResult(result.converted.amount);
    } catch (error) {
      console.error('Erreur conversion:', error);
      alert('Taux de change non disponible pour cette paire');
    }
  };

  const resetForm = () => {
    setFormData({
      fromCurrency: 'USD',
      toCurrency: 'XOF',
      rate: '',
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Taux de change</h2>
          <p className="text-gray-600">{rates.length} taux configurés</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowConverter(!showConverter)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <span>💱</span>
            <span>Convertisseur</span>
          </button>
          <button
            onClick={() => { resetForm(); setEditingRate(null); setShowModal(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>Nouveau taux</span>
          </button>
        </div>
      </div>

      {/* Converter */}
      {showConverter && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-bold text-purple-900 mb-4">💱 Convertisseur de devises</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
              <input
                type="number"
                value={converterAmount}
                onChange={(e) => setConverterAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
              <select
                value={converterFrom}
                onChange={(e) => setConverterFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {COMMON_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vers</label>
              <select
                value={converterTo}
                onChange={(e) => setConverterTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {COMMON_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleConvert}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Convertir
            </button>
          </div>
          {convertedResult !== null && (
            <div className="mt-4 p-4 bg-white rounded-lg text-center">
              <p className="text-sm text-gray-600">Résultat</p>
              <p className="text-2xl font-bold text-purple-700">
                {converterAmount} {converterFrom} = {convertedResult.toFixed(2)} {converterTo}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Rates Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paire</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Taux</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Exemple</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière MAJ</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rates.map((rate) => (
                <tr key={rate.id} className={`hover:bg-gray-50 ${!rate.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-blue-600">{rate.fromCurrency}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-bold text-green-600">{rate.toCurrency}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-lg font-semibold">{rate.rate}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    1 {rate.fromCurrency} = {rate.rate} {rate.toCurrency}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(rate)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rate.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {rate.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(rate.updatedAt).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(rate)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(rate.id)}
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
        {rates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun taux de change configuré
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
        <h3 className="font-bold text-amber-900 mb-2">💡 Information</h3>
        <p className="text-amber-800 text-sm">
          Les taux de change sont utilisés pour convertir les prix des services entre différentes devises.
          Assurez-vous de maintenir les taux à jour pour une facturation précise.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {COMMON_CURRENCIES.slice(0, 5).map(c => (
            <span key={c.code} className="px-2 py-1 bg-amber-200 text-amber-900 rounded text-xs">
              {c.symbol} {c.code}
            </span>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingRate ? 'Modifier le taux' : 'Nouveau taux de change'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise source</label>
                  <select
                    value={formData.fromCurrency}
                    onChange={(e) => setFormData({ ...formData, fromCurrency: e.target.value })}
                    disabled={!!editingRate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    {COMMON_CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise cible</label>
                  <select
                    value={formData.toCurrency}
                    onChange={(e) => setFormData({ ...formData, toCurrency: e.target.value })}
                    disabled={!!editingRate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    {COMMON_CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taux (1 {formData.fromCurrency} = ? {formData.toCurrency})
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="615.50"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rateIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="rateIsActive" className="text-sm text-gray-700">Actif</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingRate(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingRate ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
