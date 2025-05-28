
import React, { useState, useCallback, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { Agendamento, ApiError } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import Table from '../common/Table';
import { Icons } from '../../constants';
import toast from 'react-hot-toast';

type SearchType = 'all' | 'telefone' | 'status' | 'documento';

const AgendamentosPage: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pendente' | 'pago' | 'atrasado' | 'cancelado' | ''>('');

  const fetchAgendamentos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAgendamentos([]);
    try {
      let data: Agendamento[] = [];
      if (searchType === 'all') {
        data = await apiService.getAllAgendamentos();
        toast.success('Todos os agendamentos carregados.');
      } else if (searchType === 'telefone' && searchTerm) {
        data = await apiService.getAgendamentosByTelefone(searchTerm);
        toast.success(`Agendamentos para o telefone ${searchTerm} carregados.`);
      } else if (searchType === 'status' && statusFilter) {
        data = await apiService.getAgendamentosByStatus(statusFilter);
        toast.success(`Agendamentos com status ${statusFilter} carregados.`);
      } else if (searchType === 'documento' && searchTerm) {
        data = await apiService.getAgendamentosByDocumento(searchTerm);
        toast.success(`Agendamentos para o documento ${searchTerm} carregados.`);
      } else if ((searchType === 'telefone' || searchType === 'documento') && !searchTerm) {
         toast.error('Por favor, insira um termo de busca.');
         setIsLoading(false);
         return;
      } else if (searchType === 'status' && !statusFilter) {
        toast.error('Por favor, selecione um status.');
        setIsLoading(false);
        return;
      }
      setAgendamentos(data);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Falha ao buscar agendamentos.');
      toast.error(apiErr.message || 'Falha ao buscar agendamentos.');
    } finally {
      setIsLoading(false);
    }
  }, [searchType, searchTerm, statusFilter]);

  useEffect(() => {
    if (searchType === 'all') {
      fetchAgendamentos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType]); // fetch when 'all' is selected


  const columns: { key: keyof Agendamento | string; header: string; render?: (item: Agendamento) => React.ReactNode }[] = [
    { key: 'nome_cliente', header: 'Cliente' },
    { key: 'telefone', header: 'Telefone' },
    { key: 'documento', header: 'Documento' },
    { key: 'data_agendamento', header: 'Data', render: (item) => new Date(item.data_agendamento).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) },
    { key: 'hora_agendamento', header: 'Hora' },
    { key: 'servico', header: 'Serviço' },
    { key: 'valor', header: 'Valor', render: (item) => item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
    { 
      key: 'status_pagamento', 
      header: 'Status Pag.',
      render: (item) => {
        let colorClass = '';
        switch(item.status_pagamento) {
          case 'pago': colorClass = 'text-green-400'; break;
          case 'pendente': colorClass = 'text-yellow-400'; break;
          case 'atrasado': colorClass = 'text-red-400'; break;
          case 'cancelado': colorClass = 'text-gray-500'; break;
        }
        return <span className={`font-semibold px-2 py-1 rounded-full bg-opacity-20 ${colorClass.replace('text-', 'bg-')} ${colorClass}`}>{item.status_pagamento}</span>;
      }
    },
  ];

  return (
    <div className="space-y-6">
      <header className="pb-4 border-b border-futuristic-primary/20">
        <h1 className="text-3xl font-orbitron text-futuristic-primary">Gerenciamento de Agendamentos</h1>
        <p className="mt-1 text-md text-futuristic-text-secondary">Visualize e filtre os agendamentos do sistema.</p>
      </header>

      <Card title="Filtros de Busca">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="searchType" className="block text-sm font-medium text-futuristic-text-secondary mb-1.5">Tipo de Busca</label>
              <select
                id="searchType"
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value as SearchType);
                  setSearchTerm('');
                  setStatusFilter('');
                  setAgendamentos([]); // Clear results when changing type
                }}
                className="w-full px-3 py-2.5 rounded-lg bg-futuristic-bg-secondary border border-futuristic-primary/30 focus:border-futuristic-primary focus:ring-1 focus:ring-futuristic-primary focus:outline-none text-futuristic-text"
              >
                <option value="all">Todos Agendamentos</option>
                <option value="telefone">Por Telefone</option>
                <option value="status">Por Status Pagamento</option>
                <option value="documento">Por Documento</option>
              </select>
            </div>

            {(searchType === 'telefone' || searchType === 'documento') && (
              <Input
                label={`Buscar por ${searchType === 'telefone' ? 'Telefone' : 'Documento'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchType === 'telefone' ? 'Ex: 55119...': 'Ex: 12345678901'}
                className="md:col-span-2"
              />
            )}
            
            {searchType === 'status' && (
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-futuristic-text-secondary mb-1.5">Status</label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-lg bg-futuristic-bg-secondary border border-futuristic-primary/30 focus:border-futuristic-primary focus:ring-1 focus:ring-futuristic-primary focus:outline-none text-futuristic-text"
                >
                  <option value="">Selecione um status</option>
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="atrasado">Atrasado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            )}
            
            <Button 
              onClick={fetchAgendamentos} 
              isLoading={isLoading} 
              disabled={isLoading || (searchType !== 'all' && !searchTerm && searchType !== 'status') || (searchType === 'status' && !statusFilter)}
              leftIcon={<Icons.Search className="w-5 h-5"/>}
            >
              Buscar
            </Button>
          </div>
        </div>
      </Card>

      {isLoading && <Spinner />}
      
      {!isLoading && agendamentos.length > 0 && (
        <Card title="Resultados dos Agendamentos">
          <Table 
            columns={columns} 
            data={agendamentos} 
            keyExtractor={(item) => `${item.documento}-${item.data_agendamento}-${item.hora_agendamento}-${item.servico}`} 
          />
        </Card>
      )}
       {!isLoading && agendamentos.length === 0 && searchType !== 'all' && (searchTerm || statusFilter) && (
        <Card>
          <p className="text-center text-futuristic-text-secondary py-4">Nenhum agendamento encontrado para os critérios de busca.</p>
        </Card>
      )}
    </div>
  );
};

export default AgendamentosPage;
