import { useState } from 'react';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminOperations from './AdminOperations';
import AdminServicePricing from './AdminServicePricing';
import AdminExchangeRates from './AdminExchangeRates';
import AdminAuditLogs from './AdminAuditLogs';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsers />;
      case 'operations':
        return <AdminOperations />;
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
