import React from 'react';
import { useAuth } from '/context/AuthContext';
import { useCart } from '/context/CartContext';
import { Button } from '/ui/button';
import { Input } from '/ui/input';
import { Badge } from '/ui/badge';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
  Clock,
  LogOut,
  Search,
  UtensilsCrossed,
} from 'lucide-react';

interface ClientLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const ClientLayout = ({ children, currentPage, onNavigate }: ClientLayoutProps) => {
  const { user, logout } = useAuth();
  const { getItemsCount } = useCart();
  const cartCount = getItemsCount();

  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'products', label: 'Cardápio', icon: ShoppingBag },
    { id: 'orders', label: 'Pedidos', icon: Clock },
    { id: 'cart', label: 'Carrinho', icon: ShoppingCart, badge: cartCount },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">DeliveryFood</h1>
                <p className="text-xs text-gray-500">Seu delivery favorito</p>
              </div>
            </div>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar produtos..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search - Mobile */}
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className={`relative whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge className="ml-2 bg-green-500 text-white h-5 min-w-5 flex items-center justify-center p-1">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 DeliveryFood. Todos os direitos reservados.</p>
            <p className="mt-2">Sistema de Delivery Completo</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
