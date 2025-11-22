import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Switch } from '@shared/ui/switch';
import { Label } from '@shared/ui/label';
import { horariosAPI } from '@shared/services/api';
import { toast } from 'sonner';
import { Clock, Loader2 } from 'lucide-react';

const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

interface BusinessHours {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export const BusinessHoursManagement = () => {
  const [hours, setHours] = useState<BusinessHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const restaurantId = 1; // Usar o ID do restaurante do contexto/auth

  // Carregar horários do banco ao montar o componente
  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    try {
      setLoading(true);
      const data = await horariosAPI.buscar(restaurantId);
      setHours(data);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      toast.error('Erro ao carregar horários');
      // Usar dados padrão em caso de erro
      setHours(createDefaultHours());
    } finally {
      setLoading(false);
    }
  };

  const createDefaultHours = (): BusinessHours[] => [
    { dayOfWeek: 0, isOpen: true, openTime: '11:00', closeTime: '23:00' },
    { dayOfWeek: 1, isOpen: true, openTime: '11:00', closeTime: '23:00' },
    { dayOfWeek: 2, isOpen: true, openTime: '11:00', closeTime: '23:00' },
    { dayOfWeek: 3, isOpen: true, openTime: '11:00', closeTime: '23:00' },
    { dayOfWeek: 4, isOpen: true, openTime: '11:00', closeTime: '23:00' },
    { dayOfWeek: 5, isOpen: true, openTime: '11:00', closeTime: '00:00' },
    { dayOfWeek: 6, isOpen: true, openTime: '11:00', closeTime: '00:00' },
  ];

  const handleSave = async () => {
    try {
      setSaving(true);
      await horariosAPI.atualizar(restaurantId, hours);
      toast.success('Horários atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
      toast.error('Erro ao atualizar horários');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6 flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Carregando horários...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Horários de Funcionamento</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configurar Horários
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hours.map((day, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-32">
                <p className="font-semibold text-gray-900">{daysOfWeek[day.dayOfWeek]}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={day.isOpen}
                  onCheckedChange={(checked: boolean) => {
                    const newHours = [...hours];
                    newHours[index].isOpen = checked;
                    setHours(newHours);
                  }}
                />
                <Label>{day.isOpen ? 'Aberto' : 'Fechado'}</Label>
              </div>
              {day.isOpen && (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={day.openTime}
                    onChange={(e) => {
                      const newHours = [...hours];
                      newHours[index].openTime = e.target.value;
                      setHours(newHours);
                    }}
                    className="w-32"
                  />
                  <span>até</span>
                  <Input
                    type="time"
                    value={day.closeTime}
                    onChange={(e) => {
                      const newHours = [...hours];
                      newHours[index].closeTime = e.target.value;
                      setHours(newHours);
                    }}
                    className="w-32"
                  />
                </div>
              )}
            </div>
          ))}
          <Button 
            onClick={handleSave} 
            className="w-full"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
