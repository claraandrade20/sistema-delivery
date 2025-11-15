import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '/ui/card';
import { Button } from '/ui/button';
import { Input } from '/ui/input';
import { Switch } from '/ui/switch';
import { Label } from '/ui/label';
import { mockRestaurants } from '/data/mockData';
import { toast } from 'sonner@2.0.3';
import { Clock } from 'lucide-react';

const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const BusinessHoursManagement = () => {
  const restaurant = mockRestaurants[0];
  const [hours, setHours] = useState(restaurant.businessHours);

  const handleSave = () => {
    toast.success('Horários atualizados com sucesso!');
  };

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
                  onCheckedChange={(checked) => {
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
          <Button onClick={handleSave} className="w-full">
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
