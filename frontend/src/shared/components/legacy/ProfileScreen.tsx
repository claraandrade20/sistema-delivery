import { ArrowLeft, User, MapPin, CreditCard, Settings, HelpCircle, LogOut, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';

interface ProfileScreenProps {
  onBack: () => void;
  onAdminMode: () => void;
}

export function ProfileScreen({ onBack, onAdminMode }: ProfileScreenProps) {
  const menuItems = [
    { icon: User, label: 'Dados Pessoais', action: () => {} },
    { icon: MapPin, label: 'Endereços Salvos', action: () => {} },
    { icon: CreditCard, label: 'Formas de Pagamento', action: () => {} },
    { icon: Settings, label: 'Configurações', action: () => {} },
    { icon: HelpCircle, label: 'Ajuda e Suporte', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-b-3xl">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-full mb-4"
        >
          <ArrowLeft className="size-6" />
        </button>
        
        <div className="flex items-center gap-4">
          <Avatar className="size-20 border-4 border-white">
            <AvatarFallback className="bg-orange-600 text-white text-2xl">
              JP
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-white mb-1">João Pedro</h1>
            <p className="text-orange-100">joao@email.com</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 mt-4">
        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <button
                    onClick={item.action}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="size-6 text-gray-600" />
                    <span className="flex-1 text-left text-gray-900">
                      {item.label}
                    </span>
                    <span className="text-gray-400">›</span>
                  </button>
                  {index < menuItems.length - 1 && <Separator />}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Admin Mode */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <button
              onClick={onAdminMode}
              className="w-full flex items-center gap-4"
            >
              <div className="bg-blue-600 p-2 rounded-lg">
                <ShieldCheck className="size-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-gray-900">Modo Funcionário</h3>
                <p className="text-sm text-gray-600">
                  Gerenciar estoque e pedidos
                </p>
              </div>
              <span className="text-blue-600">›</span>
            </button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-4">
            <button className="w-full flex items-center gap-4 text-red-600">
              <LogOut className="size-6" />
              <span className="flex-1 text-left">Sair da Conta</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
