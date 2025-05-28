
import React, { useState, useCallback, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { PagamentosPorStatusData, ApiError, PagamentoPorStatus } from '../../types';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const COLORS: {[key: string]: string} = {
  pago: '#4CAF50', // Green
  pendente: '#FFC107', // Amber
  atrasado: '#F44336', // Red
  cancelado: '#9E9E9E', // Grey
  default: '#2196F3' // Blue for unknown statuses
};


const EstatisticasPage: React.FC = () => {
  const [statsData, setStatsData] = useState<PagamentosPorStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const fetchEstatisticas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getEstatisticasPagamentosPorStatus();
      // API might return object e.g. {pago: 10, pendente: 5} or array [{status: 'pago', count: 10}]
      // Let's ensure it's an array of objects like PagamentoPorStatus[]
      let formattedData: PagamentosPorStatusData;
      if (Array.isArray(data)) {
        formattedData = data as PagamentosPorStatusData;
      } else if (typeof data === 'object' && data !== null) {
        formattedData = Object.entries(data).map(([status, count]) => ({
          status,
          count: typeof count === 'number' ? count : 0, // Ensure count is a number
        }));
      } else {
        formattedData = [];
      }
      setStatsData(formattedData);
      toast.success('Estatísticas carregadas com sucesso!');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Falha ao buscar estatísticas.');
      toast.error(apiErr.message || 'Falha ao buscar estatísticas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstatisticas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch on mount

  const chartData = statsData?.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitalize status
    count: item.count,
    fill: COLORS[item.status.toLowerCase()] || COLORS.default,
  })) || [];

  // Calculate totalCount for percentage calculation
  const totalCount = chartData.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="space-y-6">
      <header className="pb-4 border-b border-futuristic-primary/20">
        <h1 className="text-3xl font-orbitron text-futuristic-primary">Estatísticas de Pagamentos</h1>
        <p className="mt-1 text-md text-futuristic-text-secondary">Visualize a distribuição de pagamentos por status.</p>
      </header>

      {isLoading && <Spinner />}
      
      {!isLoading && !statsData && error && (
        <Card title="Erro">
          <p className="text-red-400">{error}</p>
        </Card>
      )}

      {!isLoading && statsData && statsData.length === 0 && (
        <Card title="Estatísticas">
          <p className="text-center text-futuristic-text-secondary">Nenhuma estatística de pagamento disponível.</p>
        </Card>
      )}

      {!isLoading && statsData && statsData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Contagem por Status (Gráfico de Barras)">
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="#4A5568" />
                  <XAxis dataKey="name" tick={{ fill: '#A0AEC0' }} />
                  <YAxis tick={{ fill: '#A0AEC0' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: '1px solid #4A5568', borderRadius: '0.375rem', color: '#E2E8F0' }}
                    labelStyle={{ color: '#00E5FF', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                  <Bar dataKey="count" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Distribuição Percentual (Gráfico de Pizza)">
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    dataKey="count"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: '1px solid #4A5568', borderRadius: '0.375rem', color: '#E2E8F0' }}
                    labelStyle={{ color: '#00E5FF', fontWeight: 'bold' }}
                    formatter={(value: number, name: string) => {
                      const percentage = totalCount > 0 ? ((value / totalCount) * 100).toFixed(1) : '0.0';
                      return [`${value} (${percentage}%)`, name];
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
      
      {!isLoading && statsData && statsData.length > 0 && (
        <Card title="Dados Tabulares">
            <table className="min-w-full divide-y divide-futuristic-primary/20 bg-futuristic-bg-secondary">
              <thead className="bg-futuristic-bg-secondary/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-orbitron font-medium text-futuristic-accent uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-orbitron font-medium text-futuristic-accent uppercase tracking-wider">Contagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-futuristic-primary/10">
                {statsData.map((item: PagamentoPorStatus) => (
                  <tr key={item.status} className="hover:bg-futuristic-primary/5 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-futuristic-text font-semibold" style={{color: COLORS[item.status.toLowerCase()] || COLORS.default}}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-futuristic-text">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </Card>
      )}

    </div>
  );
};

export default EstatisticasPage;
