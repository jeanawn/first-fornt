import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { adminService } from '../../services/admin';
import type { ExchangeRate } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  Label,
  Modal,
  PageHeader,
  TableHead,
  fieldClass,
  tdClass,
  thClass,
} from '../../components/admin/ui';
import {
  ArrowRightIcon,
  EditIcon,
  InfoIcon,
  PlusIcon,
  SwapIcon,
  TrashIcon,
} from '../../components/icons';

const COMMON_CURRENCIES = [
  { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'CFA' },
  { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'CFA' },
  { code: 'USD', name: 'Dollar US', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
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

  const handleSubmit = async (e: FormEvent) => {
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
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Taux de change"
        description={`${rates.length} taux configurés`}
        actions={
          <>
            <Button
              onClick={() => setShowConverter(!showConverter)}
              aria-expanded={showConverter}
              icon={<SwapIcon />}
            >
              Convertisseur
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setEditingRate(null);
                setShowModal(true);
              }}
              icon={<PlusIcon />}
            >
              Nouveau taux
            </Button>
          </>
        }
      />

      {showConverter && (
        <Card className="p-5">
          <h3 className="mb-4 text-base font-semibold text-gray-900">Convertisseur de devises</h3>
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="conv-amount">Montant</Label>
              <input
                id="conv-amount"
                type="number"
                value={converterAmount}
                onChange={(e) => setConverterAmount(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <Label htmlFor="conv-from">De</Label>
              <select
                id="conv-from"
                value={converterFrom}
                onChange={(e) => setConverterFrom(e.target.value)}
                className={fieldClass}
              >
                {COMMON_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="conv-to">Vers</Label>
              <select
                id="conv-to"
                value={converterTo}
                onChange={(e) => setConverterTo(e.target.value)}
                className={fieldClass}
              >
                {COMMON_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="primary" onClick={handleConvert}>
              Convertir
            </Button>
          </div>
          {convertedResult !== null && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-wide text-gray-500">Résultat</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">
                {converterAmount} {converterFrom} = {convertedResult.toFixed(2)} {converterTo}
              </p>
            </div>
          )}
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHead>
              <th className={thClass}>Paire</th>
              <th className={`${thClass} text-right`}>Taux</th>
              <th className={thClass}>Exemple</th>
              <th className={`${thClass} text-center`}>Statut</th>
              <th className={thClass}>Dernière MAJ</th>
              <th className={`${thClass} text-right`}>Actions</th>
            </TableHead>
            <tbody className="divide-y divide-gray-100">
              {rates.map((rate) => (
                <tr
                  key={rate.id}
                  className={`transition-colors hover:bg-gray-50 ${!rate.isActive ? 'opacity-60' : ''}`}
                >
                  <td className={tdClass}>
                    <span className="inline-flex items-center gap-2 font-medium text-gray-900">
                      {rate.fromCurrency}
                      <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400" />
                      {rate.toCurrency}
                    </span>
                  </td>
                  <td className={`${tdClass} text-right font-mono font-medium tabular-nums text-gray-900`}>
                    {rate.rate}
                  </td>
                  <td className={`${tdClass} text-gray-500`}>
                    1 {rate.fromCurrency} = {rate.rate} {rate.toCurrency}
                  </td>
                  <td className={`${tdClass} text-center`}>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(rate)}
                      title={rate.isActive ? 'Désactiver ce taux' : 'Activer ce taux'}
                      className="rounded-md transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                    >
                      {rate.isActive ? (
                        <Badge tone="success">Actif</Badge>
                      ) : (
                        <Badge tone="danger">Inactif</Badge>
                      )}
                    </button>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-gray-500`}>
                    {new Date(rate.updatedAt).toLocaleString('fr-FR')}
                  </td>
                  <td className={`${tdClass} text-right`}>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        label={`Modifier ${rate.fromCurrency} vers ${rate.toCurrency}`}
                        onClick={() => handleEdit(rate)}
                        icon={<EditIcon />}
                      />
                      <IconButton
                        label={`Supprimer ${rate.fromCurrency} vers ${rate.toCurrency}`}
                        onClick={() => handleDelete(rate.id)}
                        icon={<TrashIcon />}
                        className="hover:bg-rose-50 hover:text-rose-700"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rates.length === 0 && <EmptyState>Aucun taux de change configuré</EmptyState>}
      </Card>

      <Card className="p-5">
        <div className="flex gap-3">
          <InfoIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">À propos des taux</h3>
            <p className="mt-1 text-sm text-gray-500">
              Les taux de change convertissent les prix des services entre devises. Maintenez-les à
              jour pour une facturation précise.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {COMMON_CURRENCIES.slice(0, 5).map((c) => (
                <Badge key={c.code}>
                  {c.symbol} {c.code}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {showModal && (
        <Modal
          title={editingRate ? 'Modifier le taux' : 'Nouveau taux de change'}
          onClose={() => {
            setShowModal(false);
            setEditingRate(null);
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rate-from">Devise source</Label>
                <select
                  id="rate-from"
                  value={formData.fromCurrency}
                  onChange={(e) => setFormData({ ...formData, fromCurrency: e.target.value })}
                  disabled={!!editingRate}
                  className={fieldClass}
                >
                  {COMMON_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="rate-to">Devise cible</Label>
                <select
                  id="rate-to"
                  value={formData.toCurrency}
                  onChange={(e) => setFormData({ ...formData, toCurrency: e.target.value })}
                  disabled={!!editingRate}
                  className={fieldClass}
                >
                  {COMMON_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="rate-value">
                Taux (1 {formData.fromCurrency} = ? {formData.toCurrency})
              </Label>
              <input
                id="rate-value"
                type="number"
                step="0.000001"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                required
                className={fieldClass}
                placeholder="615.50"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              Actif
            </label>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => {
                  setShowModal(false);
                  setEditingRate(null);
                }}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                {editingRate ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
