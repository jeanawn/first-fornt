import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { adminService } from '../../services/admin';
import type { ServicePricing, ReferenceCountry, ReferenceService } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CURRENCY_LABEL, formatAmount } from '../../utils/currency';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
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
import { CloseIcon, EditIcon, PlusIcon, TrashIcon } from '../../components/icons';
import { errorMessage } from '../../components/admin/useFeedback';

/** CFA zone currencies all display as FCFA; others keep their ISO code. */
function currencyLabel(currency: string): string {
  return currency === 'XOF' || currency === 'XAF' ? CURRENCY_LABEL : currency;
}

export default function AdminServicePricing() {
  const [pricings, setPricings] = useState<ServicePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPricing, setEditingPricing] = useState<ServicePricing | null>(null);
  const [searchService, setSearchService] = useState('');
  const [searchCountry, setSearchCountry] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServicePricing | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Liste des pays et services disponibles
  const [countries, setCountries] = useState<ReferenceCountry[]>([]);
  const [services, setServices] = useState<ReferenceService[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    serviceCode: '',
    countryCode: '',
    price: '',
    currency: 'XOF',
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

  const handleSubmit = async (e: FormEvent) => {
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletePending(true);
      setDeleteError(null);
      await adminService.deleteServicePricing(deleteTarget.id);
      setDeleteTarget(null);
      setSuccessMessage('Tarif supprimé.');
      setTimeout(() => setSuccessMessage(null), 4000);
      loadPricings();
    } catch (error) {
      console.error('Erreur suppression:', error);
      setDeleteError(errorMessage(error, 'La suppression a échoué. Réessayez.'));
    } finally {
      setDeletePending(false);
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
      currency: 'XOF',
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
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3"
        >
          <p className="text-sm text-rose-700">{error}</p>
          <IconButton
            label="Fermer"
            onClick={() => setError(null)}
            icon={<CloseIcon />}
            className="h-6 w-6 flex-shrink-0 text-rose-600 hover:bg-rose-100 hover:text-rose-800"
          />
        </div>
      )}
      {successMessage && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {successMessage}
        </div>
      )}

      <PageHeader
        title="Tarification des services"
        description={
          loadingOptions
            ? `${pricings.length} tarifs configurés · chargement des options…`
            : `${pricings.length} tarifs configurés`
        }
        actions={
          <Button
            variant="primary"
            onClick={() => { resetForm(); setEditingPricing(null); setShowModal(true); }}
            disabled={loadingOptions || services.length === 0 || countries.length === 0}
            icon={<PlusIcon />}
          >
            Nouveau tarif
          </Button>
        }
      />

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="filter-service">Service</Label>
            <select
              id="filter-service"
              value={searchService}
              onChange={(e) => setSearchService(e.target.value)}
              disabled={loadingOptions}
              className={fieldClass}
            >
              <option value="">{loadingOptions ? 'Chargement…' : 'Tous les services'}</option>
              {services.map((service) => (
                <option key={service.code} value={service.code}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="filter-country">Pays</Label>
            <select
              id="filter-country"
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
              disabled={loadingOptions}
              className={fieldClass}
            >
              <option value="">{loadingOptions ? 'Chargement…' : 'Tous les pays'}</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHead>
              <th className={thClass}>Service</th>
              <th className={thClass}>Pays</th>
              <th className={`${thClass} text-right`}>Prix</th>
              <th className={`${thClass} text-right`}>Coût</th>
              <th className={`${thClass} text-right`}>Marge</th>
              <th className={`${thClass} text-center`}>Statut</th>
              <th className={`${thClass} text-right`}>Actions</th>
            </TableHead>
            <tbody className="divide-y divide-gray-100">
              {filteredPricings.map((pricing) => (
                <tr
                  key={pricing.id}
                  className={`transition-colors hover:bg-gray-50 ${!pricing.isActive ? 'opacity-60' : ''}`}
                >
                  <td className={tdClass}>
                    <span className="font-medium text-gray-900">
                      {getServiceName(pricing.serviceCode)}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">({pricing.serviceCode})</span>
                  </td>
                  <td className={tdClass}>
                    <span className="flex items-center gap-2">
                      {getCountryFlag(pricing.countryCode) && (
                        <img
                          src={getCountryFlag(pricing.countryCode)}
                          alt=""
                          width={20}
                          height={16}
                          className="h-4 w-5 rounded-sm object-cover ring-1 ring-gray-200"
                        />
                      )}
                      <span>
                        <span className="text-gray-900">{getCountryName(pricing.countryCode)}</span>
                        <span className="ml-1 text-xs text-gray-400">({pricing.countryCode})</span>
                      </span>
                    </span>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-right font-medium tabular-nums text-gray-900`}>
                    {formatAmount(pricing.price)}
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      {currencyLabel(pricing.currency)}
                    </span>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-right tabular-nums text-gray-500`}>
                    {pricing.costPrice
                      ? `${formatAmount(pricing.costPrice)} ${currencyLabel(pricing.currency)}`
                      : '—'}
                  </td>
                  <td className={`${tdClass} text-right tabular-nums text-gray-500`}>
                    {pricing.margin ? `${pricing.margin}%` : '—'}
                  </td>
                  <td className={`${tdClass} text-center`}>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(pricing)}
                      title={pricing.isActive ? 'Désactiver ce tarif' : 'Activer ce tarif'}
                      className="rounded-md transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                    >
                      {pricing.isActive ? (
                        <Badge tone="success">Actif</Badge>
                      ) : (
                        <Badge tone="danger">Inactif</Badge>
                      )}
                    </button>
                  </td>
                  <td className={`${tdClass} text-right`}>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        label={`Modifier le tarif ${getServiceName(pricing.serviceCode)}`}
                        onClick={() => handleEdit(pricing)}
                        icon={<EditIcon />}
                      />
                      <IconButton
                        label={`Supprimer le tarif ${getServiceName(pricing.serviceCode)}`}
                        onClick={() => setDeleteTarget(pricing)}
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
        {filteredPricings.length === 0 && <EmptyState>Aucun tarif trouvé</EmptyState>}
      </Card>

      {deleteTarget && (
        <ConfirmDialog
          title="Supprimer ce tarif"
          summary={[
            { label: 'Service', value: getServiceName(deleteTarget.serviceCode) },
            { label: 'Pays', value: getCountryName(deleteTarget.countryCode) },
            {
              label: 'Prix',
              value: `${formatAmount(deleteTarget.price)} ${currencyLabel(deleteTarget.currency)}`,
            },
          ]}
          question="Ce service ne sera plus vendable pour ce pays. Pour le retirer temporairement, désactivez-le plutôt que de le supprimer."
          confirmLabel="Supprimer"
          pending={deletePending}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => {
            setDeleteTarget(null);
            setDeleteError(null);
          }}
        />
      )}

      {showModal && (
        <Modal
          title={editingPricing ? 'Modifier le tarif' : 'Nouveau tarif'}
          onClose={() => { setShowModal(false); setEditingPricing(null); }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="form-service">Service *</Label>
                <select
                  id="form-service"
                  value={formData.serviceCode}
                  onChange={(e) => setFormData({ ...formData, serviceCode: e.target.value })}
                  required
                  disabled={!!editingPricing || loadingOptions}
                  className={fieldClass}
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
                <Label htmlFor="form-country">Pays *</Label>
                <select
                  id="form-country"
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  required
                  disabled={!!editingPricing || loadingOptions}
                  className={fieldClass}
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
                <Label htmlFor="form-price">Prix de vente *</Label>
                <input
                  id="form-price"
                  type="number"
                  step="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className={fieldClass}
                  placeholder="1500"
                />
              </div>
              <div>
                <Label htmlFor="form-currency">Devise</Label>
                <select
                  id="form-currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className={fieldClass}
                >
                  <option value="XOF">XOF (FCFA)</option>
                  <option value="XAF">XAF (FCFA)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="NGN">NGN (₦)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="form-cost">Prix d'achat</Label>
                <input
                  id="form-cost"
                  type="number"
                  step="1"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  className={fieldClass}
                  placeholder="800"
                />
              </div>
              <div>
                <Label htmlFor="form-margin">Marge (%)</Label>
                <input
                  id="form-margin"
                  type="number"
                  step="0.1"
                  value={formData.margin}
                  onChange={(e) => setFormData({ ...formData, margin: e.target.value })}
                  className={fieldClass}
                  placeholder="20"
                />
              </div>
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
                onClick={() => { setShowModal(false); setEditingPricing(null); }}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                {editingPricing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
