import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import type { AdminUser } from '../../services/admin';
import { authService } from '../../services/auth';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [page, search, roleFilter]);

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
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (user: AdminUser) => {
    try {
      setStatusPendingId(user.id);
      setActionError(null);
      await adminService.updateUserStatus(user.id, !user.isActive);
      loadUsers();
    } catch (error) {
      const message = (error as { message?: string })?.message
        || `Erreur lors de ${user.isActive ? 'la désactivation' : "l'activation"} de ${user.username}`;
      setActionError(message);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Utilisateurs</h2>
          <p className="text-gray-600">Gestion des comptes utilisateurs</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher par email ou nom d'utilisateur..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value as '' | 'user' | 'admin'); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="">Tous les rôles</option>
            <option value="user">Utilisateurs</option>
            <option value="admin">Administrateurs</option>
          </select>
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            🔍 Rechercher
          </button>
        </div>
      </div>

      {/* Action Error */}
      {actionError && (
        <div className="flex items-start justify-between bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
          <p className="text-sm">{actionError}</p>
          <button
            onClick={() => setActionError(null)}
            className="ml-4 text-red-500 hover:text-red-700"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Solde</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rôle</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscription</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className={`hover:bg-gray-50 ${!user.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-green-600">{user.balance.toLocaleString()}</span>
                        <span className="text-gray-400 text-sm ml-1">FCFA</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openRoleModal(user)}
                          disabled={user.id === currentUserId}
                          title={user.id === currentUserId ? 'Vous ne pouvez pas changer votre propre rôle' : 'Changer le rôle'}
                          className={`px-2 py-1 rounded-full text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 enabled:hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-800 enabled:hover:bg-gray-200'
                          }`}
                        >
                          {user.role === 'admin' ? '👑 Admin' : 'User'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleStatusToggle(user)}
                          disabled={statusPendingId === user.id}
                          title={user.isActive ? 'Désactiver le compte' : 'Activer le compte'}
                          className={`px-2 py-1 rounded-full text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
                            user.isActive
                              ? 'bg-green-100 text-green-800 enabled:hover:bg-green-200'
                              : 'bg-red-100 text-red-800 enabled:hover:bg-red-200'
                          }`}
                        >
                          {statusPendingId === user.id ? '...' : user.isActive ? 'Actif' : 'Inactif'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => openBalanceModal(user, 'credit')}
                            className="p-1 text-green-600 hover:bg-green-100 rounded text-sm"
                            title="Créditer"
                          >
                            ➕
                          </button>
                          <button
                            onClick={() => openBalanceModal(user, 'debit')}
                            className="p-1 text-red-600 hover:bg-red-100 rounded text-sm"
                            title="Débiter"
                          >
                            ➖
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun utilisateur trouvé
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  ← Précédent
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} sur {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Role Modal */}
      {roleUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {roleUser.role === 'admin' ? 'Rétrograder en utilisateur' : 'Promouvoir en administrateur'}
            </h3>
            <p className="text-gray-600 mb-4">
              Utilisateur: <strong>{roleUser.username}</strong> ({roleUser.email})
              <br />
              Rôle actuel: <strong>{roleUser.role === 'admin' ? 'Admin' : 'User'}</strong>
              {' → '}
              Nouveau rôle: <strong>{roleUser.role === 'admin' ? 'User' : 'Admin'}</strong>
            </p>
            {roleUser.role !== 'admin' && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                Un administrateur a accès à tous les comptes, soldes et opérations.
              </p>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raison (optionnel)</label>
                <input
                  type="text"
                  value={roleReason}
                  onChange={(e) => setRoleReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nouveau membre de l'équipe support, etc."
                />
              </div>
              {roleError && (
                <p className="text-sm text-red-600">{roleError}</p>
              )}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setRoleUser(null); setRoleError(null); }}
                  disabled={roleSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRoleChange}
                  disabled={roleSubmitting}
                  className={`flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
                    roleUser.role === 'admin'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {roleSubmitting ? 'En cours...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Balance Modal */}
      {showBalanceModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {showBalanceModal === 'credit' ? '➕ Créditer' : '➖ Débiter'} le compte
            </h3>
            <p className="text-gray-600 mb-4">
              Utilisateur: <strong>{selectedUser.username}</strong> ({selectedUser.email})
              <br />
              Solde actuel: <strong>{selectedUser.balance.toFixed(2)} $</strong>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                <input
                  type="number"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raison (optionnel)</label>
                <input
                  type="text"
                  value={balanceReason}
                  onChange={(e) => setBalanceReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Bonus, remboursement, etc."
                />
              </div>
              {balanceError && (
                <p className="text-sm text-red-600">{balanceError}</p>
              )}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowBalanceModal(null); setSelectedUser(null); setBalanceError(null); }}
                  disabled={balanceSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleBalanceAction}
                  disabled={balanceSubmitting || !balanceAmount || parseFloat(balanceAmount) <= 0}
                  className={`flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
                    showBalanceModal === 'credit'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {balanceSubmitting ? 'En cours...' : showBalanceModal === 'credit' ? 'Créditer' : 'Débiter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
