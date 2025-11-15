import { Home, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { Badge } from './ui/badge';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  cartItemCount: number;
}

export function BottomNav({ currentScreen, onNavigate, cartItemCount }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'cart', label: 'Carrinho', icon: ShoppingCart, badge: cartItemCount },
    { id: 'orders', label: 'Pedidos', icon: ClipboardList },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="max-w-md mx-auto grid grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center py-3 px-2 relative"
            >
              <div className="relative">
                <Icon
                  className={`size-6 ${
                    isActive ? 'text-orange-600' : 'text-gray-400'
                  }`}
                />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 size-5 flex items-center justify-center p-0 bg-red-500">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span
                className={`text-xs mt-1 ${
                  isActive ? 'text-orange-600' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
