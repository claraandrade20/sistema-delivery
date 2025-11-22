import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { toast } from 'sonner';

const revenueData = [
  { month: 'Jan', revenue: 12000, orders: 120 },
  { month: 'Fev', revenue: 15000, orders: 145 },
  { month: 'Mar', revenue: 13000, orders: 130 },
  { month: 'Abr', revenue: 18000, orders: 170 },
  { month: 'Mai', revenue: 22000, orders: 200 },
  { month: 'Jun', revenue: 25000, orders: 230 },
];

const restaurantPerformance = [
  { name: 'Pizzaria Bella Napoli', value: 35 },
  { name: 'Burger House Premium', value: 28 },
  { name: 'Outros', value: 37 },
];

const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899'];

export const ReportsPage = () => {
  const downloadReport = () => {
    // Simular download de PDF
    const reportContent = `
RELATÓRIO DE DESEMPENHO - ${new Date().toLocaleDateString('pt-BR')}
================================================

RESUMO EXECUTIVO:
- Receita Total: R$ 105.000,00
- Total de Pedidos: 995
- Clientes Ativos: 285
- Crescimento: +18.2%

RESULTADOS POR MÊS:
- Janeiro: R$ 12.000,00 (120 pedidos)
- Fevereiro: R$ 15.000,00 (145 pedidos)
- Março: R$ 13.000,00 (130 pedidos)
- Abril: R$ 18.000,00 (170 pedidos)
- Maio: R$ 22.000,00 (200 pedidos)
- Junho: R$ 25.000,00 (230 pedidos)

DISTRIBUIÇÃO POR RESTAURANTE:
- Pizzaria Bella Napoli: 35%
- Burger House Premium: 28%
- Outros: 37%

Gerado em: ${new Date().toLocaleString('pt-BR')}
    `;

    // Criar blob e download
    const element = document.createElement('a');
    const file = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `relatorio-desempenho-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Relatório exportado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">Análise completa do desempenho do sistema</p>
        </div>
        <Button onClick={downloadReport} className="bg-purple-600 hover:bg-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">R$ 105.000</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">995</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">285</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crescimento</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">+18.2%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Receita e Pedidos por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="revenue" fill="#8b5cf6" name="Receita (R$)" />
                <Bar yAxisId="right" dataKey="orders" fill="#3b82f6" name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Restaurante</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={restaurantPerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {restaurantPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Receita (Últimos 6 Meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} name="Receita" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
