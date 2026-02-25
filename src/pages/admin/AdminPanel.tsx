import { useState } from 'react';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminOperations from './AdminOperations';
import AdminTransactions from './AdminTransactions';
import AdminServicePricing from './AdminServicePricing';
import AdminExchangeRates from './AdminExchangeRates';
import AdminAuditLogs from './AdminAuditLogs';
import { usePageTitle, PAGE_TITLES } from '../../hooks/usePageTitle';

const ADMIN_PAGE_TITLES: Record<string, string> = {
  'dashboard': PAGE_TITLES.adminDashboard,
  'users': PAGE_TITLES.adminUsers,
  'operations': PAGE_TITLES.adminOperations,
  'transactions': PAGE_TITLES.adminTransactions,
  'pricing': PAGE_TITLES.adminServicePricing,
  'exchange-rates': PAGE_TITLES.adminExchangeRates,
  'audit-logs': PAGE_TITLES.adminAuditLogs,
};

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  usePageTitle(ADMIN_PAGE_TITLES[currentPage] || PAGE_TITLES.admin);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsers />;
      case 'operations':
        return <AdminOperations />;
      case 'transactions':
        return <AdminTransactions />;
      case 'pricing':
        return <AdminServicePricing />;
      case 'exchange-rates':
        return <AdminExchangeRates />;
      case 'audit-logs':
        return <AdminAuditLogs />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={onLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
}
