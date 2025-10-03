import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,

  Download,
  BarChart3
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';

interface SalesData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  newCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

interface TopProduct {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

export function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [salesData, setSalesData] = useState<SalesData>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    newCustomers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [revenueByDay, setRevenueByDay] = useState<{ date: string; revenue: number }[]>([]);

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const startDate = new Date();

      if (dateRange === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (dateRange === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      } else {
        startDate.setFullYear(now.getFullYear() - 1);
      }

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .neq('status', 'cancelado');

      if (ordersError) throw ordersError;

      const { data: allOrders, error: allOrdersError } = await supabase
        .from('orders')
        .select('*')
        .neq('status', 'cancelado');

      if (allOrdersError) throw allOrdersError;

      const { data: users, error: usersError } = await supabase
        .from('users_profile')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (usersError) throw usersError;

      const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0) || 0;
      const totalOrders = orders?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const previousStartDate = new Date(startDate);
      if (dateRange === 'week') {
        previousStartDate.setDate(previousStartDate.getDate() - 7);
      } else if (dateRange === 'month') {
        previousStartDate.setMonth(previousStartDate.getMonth() - 1);
      } else {
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
      }

      const previousOrders = allOrders?.filter(
        order => new Date(order.created_at) >= previousStartDate && new Date(order.created_at) < startDate
      ) || [];

      const previousRevenue = previousOrders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
      const ordersGrowth = previousOrders.length > 0 ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100 : 0;

      setSalesData({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        newCustomers: users?.length || 0,
        revenueGrowth,
        ordersGrowth,
      });

      const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
      orders?.forEach(order => {
        order.items.forEach((item: any) => {
          const existing = productSales.get(item.product.id) || {
            name: item.product.name,
            quantity: 0,
            revenue: 0
          };
          productSales.set(item.product.id, {
            name: item.product.name,
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + (item.totalPrice * item.quantity)
          });
        });
      });

      const topProductsArray = Array.from(productSales.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setTopProducts(topProductsArray);

      const revenueByDayMap = new Map<string, number>();
      orders?.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString('es-PE');
        const current = revenueByDayMap.get(date) || 0;
        revenueByDayMap.set(date, current + parseFloat(order.total.toString()));
      });

      const revenueByDayArray = Array.from(revenueByDayMap.entries())
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setRevenueByDay(revenueByDayArray);

    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const csvContent = [
      ['Métrica', 'Valor'],
      ['Ingresos Totales', salesData.totalRevenue.toFixed(2)],
      ['Total de Pedidos', salesData.totalOrders.toString()],
      ['Valor Promedio de Pedido', salesData.averageOrderValue.toFixed(2)],
      ['Nuevos Clientes', salesData.newCustomers.toString()],
      ['', ''],
      ['Top Productos', ''],
      ['Producto', 'Cantidad', 'Ingresos'],
      ...topProducts.map(p => [p.name, p.quantity.toString(), p.revenue.toFixed(2)])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-ventas-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout currentPage="reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes de Ventas</h1>
            <p className="text-gray-600 mt-1">Analiza el rendimiento de tu negocio</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="year">Último año</option>
            </select>
            <Button onClick={exportReport} variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando reportes...</div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  {salesData.revenueGrowth !== 0 && (
                    <span className={`text-sm font-semibold ${
                      salesData.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {salesData.revenueGrowth > 0 ? '+' : ''}{salesData.revenueGrowth.toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(salesData.totalRevenue)}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  {salesData.ordersGrowth !== 0 && (
                    <span className={`text-sm font-semibold ${
                      salesData.ordersGrowth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {salesData.ordersGrowth > 0 ? '+' : ''}{salesData.ordersGrowth.toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{salesData.totalOrders}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Ticket Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(salesData.averageOrderValue)}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Nuevos Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{salesData.newCustomers}</p>
              </div>
            </div>

            {/* Revenue chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Ingresos por Día
              </h3>
              {revenueByDay.length > 0 ? (
                <div className="space-y-3">
                  {revenueByDay.map((item, index) => {
                    const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue));
                    const widthPercent = (item.revenue / maxRevenue) * 100;

                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-24 text-sm text-gray-600">{item.date}</div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-full h-8 overflow-hidden">
                            <div
                              className="bg-[#0B8A5F] h-full rounded-full flex items-center justify-end pr-3"
                              style={{ width: `${widthPercent}%` }}
                            >
                              <span className="text-xs font-semibold text-white">
                                {formatPrice(item.revenue)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay datos para mostrar</p>
              )}
            </div>

            {/* Top products */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
              </div>
              {topProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unidades Vendidas
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ingresos
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {topProducts.map((product, index) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm text-gray-900">{product.quantity}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatPrice(product.revenue)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay datos para mostrar</p>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
