import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import type { AdminUser } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showBalanceModal, setShowBalanceModal] = useState<'credit' | 'debit' | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceReason, setBalanceReason] = useState('');

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers({
        page,
        limit: 20,
        search: search || undefined,
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
      await adminService.updateUserStatus(user.id, !user.isActive);
      loadUsers();
    } catch (error) {
      console.error('Erreur toggle statut:', error);
    }
  };

  const handleBalanceAction = async () => {
    if (!selectedUser || !showBalanceModal || !balanceAmount) return;

    try {
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
      console.error('Erreur modification solde:', error);
      alert('Erreur lors de la modification du solde');
    }
  };

  const openBalanceModal = (user: AdminUser, action: 'credit' | 'debit') => {
    setSelectedUser(user);
    setShowBalanceModal(action);
    setBalanceAmount('');
    setBalanceReason('');
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
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            🔍 Rechercher
          </button>
        </div>
      </div>

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
                        <span className="font-semibold text-green-600">{user.balance.toFixed(0)}</span>
                        <span className="text-gray-400 text-sm ml-1">$</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'admin' ? '👑 Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleStatusToggle(user)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Actif' : 'Inactif'}
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
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowBalanceModal(null); setSelectedUser(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleBalanceAction}
                  disabled={!balanceAmount || parseFloat(balanceAmount) <= 0}
                  className={`flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
                    showBalanceModal === 'credit'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {showBalanceModal === 'credit' ? 'Créditer' : 'Débiter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
