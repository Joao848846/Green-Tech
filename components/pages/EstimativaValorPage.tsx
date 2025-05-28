
import React, { useState, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import { EstimativaValor, ApiError } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import { Icons } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const EstimativaValorPage: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const nextMonthDate = new Date();
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  const nextMonth = nextMonthDate.toISOString().split('T')[0];

  const [dataInicial, setDataInicial] = useState(today);
  const [dataFinal, setDataFinal] = useState(nextMonth);
  const [estimativa, setEstimativa] = useState<EstimativaValor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const fetchEstimativa = useCallback(async () => {
    if (!dataInicial || !dataFinal) {
      toast.error('Por favor, selecione as datas inicial e final.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEstimativa(null);
    try {
      const data = await apiService.getEstimativaValor(dataInicial, dataFinal);
      setEstimativa(data);
      toast.success('Estimativa carregada com sucesso!');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Falha ao buscar estimativa de valor.');
      toast.error(apiErr.message || 'Falha ao buscar estimativa de valor.');
    } finally {
      setIsLoading(false);
    }
  }, [dataInicial, dataFinal]);

  const chartData = estimativa ? [
    { name: 'Pendente', valor: estimativa.pendente, fill: '#FFC107' }, // Amber
    { name: 'Pago', valor: estimativa.pago, fill: '#4CAF50' },     // Green
    { name: 'Atrasado', valor: estimativa.atrasado, fill: '#F44336' }, // Red
  ] : [];

  return (
    <div className="space-y-6">
      <header className="pb-4 border-b border-futuristic-primary/20">
        <h1 className="text-3xl font-orbitron text-futuristic-primary">Estimativa de Valor</h1>
        <p className="mt-1 text-md text-futuristic-text-secondary">Analise as estimativas de valor (pendente, pago, atrasado) por período.</p>
      </header>

      <Card title="Filtros de Período">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <Input
            label="Data Inicial"
            type="date"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
          />
          <Input
            label="Data Final"
            type="date"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
          />
          <Button 
            onClick={fetchEstimativa} 
            isLoading={isLoading} 
            disabled={isLoading}
            leftIcon={<Icons.Search className="w-5 h-5"/>}
          >
            Buscar Estimativa
          </Button>
        </div>
      </Card>

      {isLoading && <Spinner />}
      
      {estimativa && !isLoading && (
        <Card title="Resultados da Estimativa" bodyClassName="grid md:grid-cols-3 gap-6">
          <div className="bg-futuristic-bg p-6 rounded-lg shadow-lg border border-yellow-500/50 text-center">
            <h3 className="text-lg font-semibold text-yellow-400">Pendente</h3>
            <p className="text-4xl font-orbitron text-yellow-300 mt-2">{estimativa.pendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="bg-futuristic-bg p-6 rounded-lg shadow-lg border border-green-500/50 text-center">
            <h3 className="text-lg font-semibold text-green-400">Pago</h3>
            <p className="text-4xl font-orbitron text-green-300 mt-2">{estimativa.pago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="bg-futuristic-bg p-6 rounded-lg shadow-lg border border-red-500/50 text-center">
            <h3 className="text-lg font-semibold text-red-400">Atrasado</h3>
            <p className="text-4xl font-orbitron text-red-300 mt-2">{estimativa.atrasado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </Card>
      )}

      {estimativa && !isLoading && chartData.length > 0 && (
         <Card title="Visualização Gráfica">
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="#4A5568" />
                  <XAxis dataKey="name" tick={{ fill: '#A0AEC0' }} />
                  <YAxis tickFormatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })} tick={{ fill: '#A0AEC0' }} />
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: '1px solid #4A5568', borderRadius: '0.375rem', color: '#E2E8F0' }}
                    labelStyle={{ color: '#00E5FF', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                  <Bar dataKey="valor" name="Valor Estimado"  />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </Card>
      )}
    </div>
  );
};

export default EstimativaValorPage;
