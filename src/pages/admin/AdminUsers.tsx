import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import type { AdminUser } from '../../services/admin';
import { authService } from '../../services/auth';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatAmount, formatCurrency } from '../../utils/currency';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  FeedbackBanner,
  IconButton,
  Label,
  Modal,
  PageHeader,
  Pagination,
  TableHead,
  fieldBaseClass,
  fieldClass,
  tdClass,
  thClass,
} from '../../components/admin/ui';
import { errorMessage, useFeedback } from '../../components/admin/useFeedback';
import {
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  ShieldIcon,
} from '../../components/icons';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [roleFilter, setRoleFilter] = useState<'' | 'user' | 'admin'>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showBalanceModal, setShowBalanceModal] = useState<'credit' | 'debit' | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceReason, setBalanceReason] = useState('');
  const [balanceSubmitting, setBalanceSubmitting] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [roleUser, setRoleUser] = useState<AdminUser | null>(null);
  const [roleReason, setRoleReason] = useState('');
  const [roleSubmitting, setRoleSubmitting] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [statusPendingId, setStatusPendingId] = useState<string | null>(null);
  const { feedback, showError, clear } = useFeedback();

  useEffect(() => {
    loadUsers();
  }, [page, debouncedSearch, roleFilter]);

  // A new search term belongs on page 1, not on whatever page was open.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  useEffect(() => {
    authService.getCurrentUser()
      .then((user) => setCurrentUserId(user.id))
      .catch(() => setCurrentUserId(null));
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers({
        page,
        limit: 20,
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
      });
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      showError(errorMessage(error, 'Impossible de charger les utilisateurs.'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (user: AdminUser) => {
    try {
      setStatusPendingId(user.id);
      clear();
      await adminService.updateUserStatus(user.id, !user.isActive);
      loadUsers();
    } catch (error) {
      showError(
        errorMessage(
          error,
          `Erreur lors de ${user.isActive ? 'la désactivation' : "l'activation"} de ${user.username}`
        )
      );
    } finally {
      setStatusPendingId(null);
    }
  };

  const handleBalanceAction = async () => {
    if (!selectedUser || !showBalanceModal || !balanceAmount) return;

    try {
      setBalanceSubmitting(true);
      setBalanceError(null);
      const amount = parseFloat(balanceAmount);
      if (showBalanceModal === 'credit') {
        await adminService.creditUser(selectedUser.id, amount, balanceReason || undefined);
      } else {
        await adminService.debitUser(selectedUser.id, amount, balanceReason || undefined);
      }
      setShowBalanceModal(null);
      setSelectedUser(null);
      setBalanceAmount('');
      setBalanceReason('');
      loadUsers();
    } catch (error) {
      const message = (error as { message?: string })?.message || 'Erreur lors de la modification du solde';
      setBalanceError(message);
    } finally {
      setBalanceSubmitting(false);
    }
  };

  const openRoleModal = (user: AdminUser) => {
    setRoleUser(user);
    setRoleReason('');
    setRoleError(null);
  };

  const handleRoleChange = async () => {
    if (!roleUser) return;

    const nextRole = roleUser.role === 'admin' ? 'user' : 'admin';

    try {
      setRoleSubmitting(true);
      setRoleError(null);
      await adminService.updateUserRole(roleUser.id, nextRole, roleReason || undefined);
      setRoleUser(null);
      setRoleReason('');
      loadUsers();
    } catch (error) {
      const message = (error as { message?: string })?.message || 'Erreur lors du changement de rôle';
      setRoleError(message);
    } finally {
      setRoleSubmitting(false);
    }
  };

  const openBalanceModal = (user: AdminUser, action: 'credit' | 'debit') => {
    setSelectedUser(user);
    setShowBalanceModal(action);
    setBalanceAmount('');
    setBalanceReason('');
    setBalanceError(null);
  };

  const closeBalanceModal = () => {
    setShowBalanceModal(null);
    setSelectedUser(null);
    setBalanceError(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Utilisateurs" description="Gestion des comptes utilisateurs" />

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <label htmlFor="user-search" className="sr-only">
              Rechercher un utilisateur
            </label>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="user-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Email ou nom d'utilisateur…"
              className={`${fieldClass} pl-9`}
            />
          </div>
          <label htmlFor="user-role" className="sr-only">
            Rôle
          </label>
          <select
            id="user-role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as '' | 'user' | 'admin')}
            className={fieldBaseClass}
          >
            <option value="">Tous les rôles</option>
            <option value="user">Utilisateurs</option>
            <option value="admin">Administrateurs</option>
          </select>
        </div>
      </Card>

      <FeedbackBanner feedback={feedback} onDismiss={clear} />

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <TableHead>
                  <th className={thClass}>Utilisateur</th>
                  <th className={thClass}>Email</th>
                  <th className={`${thClass} text-right`}>Solde</th>
                  <th className={`${thClass} text-center`}>Rôle</th>
                  <th className={`${thClass} text-center`}>Statut</th>
                  <th className={thClass}>Inscription</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </TableHead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className={`transition-colors hover:bg-gray-50 ${!user.isActive ? 'opacity-60' : ''}`}
                    >
                      <td className={tdClass}>
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                          <span className="font-medium text-gray-900">{user.username}</span>
                        </div>
                      </td>
                      <td className={`${tdClass} text-gray-500`}>{user.email}</td>
                      <td className={`${tdClass} whitespace-nowrap text-right font-medium tabular-nums text-gray-900`}>
                        {formatAmount(user.balance)}
                        <span className="ml-1 text-xs font-normal text-gray-400">FCFA</span>
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <button
                          type="button"
                          onClick={() => openRoleModal(user)}
                          disabled={user.id === currentUserId}
                          title={
                            user.id === currentUserId
                              ? 'Vous ne pouvez pas changer votre propre rôle'
                              : 'Changer le rôle'
                          }
                          className="rounded-md transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {user.role === 'admin' ? (
                            <Badge tone="info" icon={<ShieldIcon className="w-3.5 h-3.5" />}>
                              Admin
                            </Badge>
                          ) : (
                            <Badge>Utilisateur</Badge>
                          )}
                        </button>
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(user)}
                          disabled={statusPendingId === user.id}
                          title={user.isActive ? 'Désactiver le compte' : 'Activer le compte'}
                          className="rounded-md transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {statusPendingId === user.id ? (
                            <Badge>…</Badge>
                          ) : user.isActive ? (
                            <Badge tone="success">Actif</Badge>
                          ) : (
                            <Badge tone="danger">Inactif</Badge>
                          )}
                        </button>
                      </td>
                      <td className={`${tdClass} whitespace-nowrap text-gray-500`}>
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className={`${tdClass} text-right`}>
                        <div className="flex items-center justify-end gap-1">
                          <IconButton
                            label={`Créditer ${user.username}`}
                            onClick={() => openBalanceModal(user, 'credit')}
                            icon={<PlusIcon />}
                          />
                          <IconButton
                            label={`Débiter ${user.username}`}
                            onClick={() => openBalanceModal(user, 'debit')}
                            icon={<MinusIcon />}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && <EmptyState>Aucun utilisateur trouvé</EmptyState>}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </Card>

      {roleUser && (
        <Modal
          title={
            roleUser.role === 'admin'
              ? 'Rétrograder en utilisateur'
              : 'Promouvoir en administrateur'
          }
          onClose={() => {
            setRoleUser(null);
            setRoleError(null);
          }}
        >
          <dl className="mb-4 space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Utilisateur</dt>
              <dd className="text-right font-medium text-gray-900">
                {roleUser.username}
                <span className="block text-xs font-normal text-gray-500">{roleUser.email}</span>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray-500">Rôle</dt>
              <dd className="flex items-center gap-2">
                <Badge>{roleUser.role === 'admin' ? 'Admin' : 'Utilisateur'}</Badge>
                <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400" />
                <Badge tone="info">{roleUser.role === 'admin' ? 'Utilisateur' : 'Admin'}</Badge>
              </dd>
            </div>
          </dl>

          {roleUser.role !== 'admin' && (
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Un administrateur a accès à tous les comptes, soldes et opérations.
            </p>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="role-reason">Raison (optionnel)</Label>
              <input
                id="role-reason"
                type="text"
                value={roleReason}
                onChange={(e) => setRoleReason(e.target.value)}
                className={fieldClass}
                placeholder="Nouveau membre de l'équipe support…"
              />
            </div>
            {roleError && (
              <p role="alert" className="text-sm text-rose-700">
                {roleError}
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => {
                  setRoleUser(null);
                  setRoleError(null);
                }}
                disabled={roleSubmitting}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant={roleUser.role === 'admin' ? 'danger' : 'primary'}
                onClick={handleRoleChange}
                disabled={roleSubmitting}
                className="flex-1"
              >
                {roleSubmitting ? 'En cours…' : 'Confirmer'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showBalanceModal && selectedUser && (
        <Modal
          title={showBalanceModal === 'credit' ? 'Créditer le compte' : 'Débiter le compte'}
          onClose={closeBalanceModal}
        >
          <dl className="mb-4 space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Utilisateur</dt>
              <dd className="text-right font-medium text-gray-900">
                {selectedUser.username}
                <span className="block text-xs font-normal text-gray-500">
                  {selectedUser.email}
                </span>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Solde actuel</dt>
              <dd className="font-medium tabular-nums text-gray-900">
                {formatCurrency(selectedUser.balance)}
              </dd>
            </div>
          </dl>

          <div className="space-y-4">
            <div>
              <Label htmlFor="balance-amount">Montant (FCFA)</Label>
              <input
                id="balance-amount"
                type="number"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className={fieldClass}
                placeholder="1000"
                min="0"
                step="1"
              />
            </div>
            <div>
              <Label htmlFor="balance-reason">Raison (optionnel)</Label>
              <input
                id="balance-reason"
                type="text"
                value={balanceReason}
                onChange={(e) => setBalanceReason(e.target.value)}
                className={fieldClass}
                placeholder="Bonus, remboursement…"
              />
            </div>
            {balanceError && (
              <p role="alert" className="text-sm text-rose-700">
                {balanceError}
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <Button onClick={closeBalanceModal} disabled={balanceSubmitting} className="flex-1">
                Annuler
              </Button>
              <Button
                variant={showBalanceModal === 'credit' ? 'primary' : 'danger'}
                onClick={handleBalanceAction}
                disabled={balanceSubmitting || !balanceAmount || parseFloat(balanceAmount) <= 0}
                className="flex-1"
                icon={showBalanceModal === 'credit' ? <PlusIcon /> : <MinusIcon />}
              >
                {balanceSubmitting
                  ? 'En cours…'
                  : showBalanceModal === 'credit'
                    ? 'Créditer'
                    : 'Débiter'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
