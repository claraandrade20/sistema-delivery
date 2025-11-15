import React from 'react';
import { useAuth } from '/context/AuthContext';
import { Button } from '/ui/button';
import { LayoutDashboard, Store, Users, UserCog, Ticket, FileText, LogOut, Shield } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const AdminLayout = ({ children, currentPage, onNavigate }: AdminLayoutProps) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'restaurants', label: 'Restaurantes', icon: Store },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'employees', label: 'Funcionários', icon: UserCog },
    { id: 'coupons', label: 'Cupons', icon: Ticket },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Admin Panel</h1>
            </div>
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="text-gray-400 text-xs">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <Button variant="ghost" onClick={logout} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-gray-700">
            <LogOut className="h-4 w-4 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
