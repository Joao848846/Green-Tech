
import React, { useState, useCallback, useEffect } from 'react';
import { apiService } from '../../../services/apiService';
import { Company, CreateCompanyPayload, ApiError } from '../../../types';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Card from '../../common/Card';
import Spinner from '../../common/Spinner';
import Table from '../../common/Table';
import { Icons } from '../../../constants';
import toast from 'react-hot-toast';

const initialFormData: CreateCompanyPayload = {
  nome: '',
  cnpj: '',
  cpf: null,
  nomeResponsavel: '',
  emailResponsavel: '',
  estadoPagamento: 0,
  planoContratado: 'BASIC',
};

const ManageCompaniesPage: React.FC = () => {
  const [formData, setFormData] = useState<CreateCompanyPayload>(initialFormData);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await apiService.getCompanies();
      setCompanies(data || []); // Ensure data is an array
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Falha ao buscar empresas.');
      toast.error(apiErr.message || 'Falha ao buscar empresas.');
      setCompanies([]); // Set to empty array on error
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const payload: CreateCompanyPayload = {
        ...formData,
        cnpj: formData.cnpj?.trim() || null,
        cpf: formData.cpf?.trim() || null,
        nomeResponsavel: formData.nomeResponsavel?.trim() || undefined, // API spec example had null, but string seems more likely for a name
    };

    try {
      await apiService.createCompany(payload);
      toast.success(`Empresa "${payload.nome}" criada com sucesso!`);
      setFormData(initialFormData); // Reset form
      fetchCompanies(); // Refresh the list
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Falha ao criar empresa.');
      setError(apiErr.message);
    } finally {
      setIsLoading(false);
    }
  }, [formData, fetchCompanies]);

  const columns: { key: keyof Company | string; header: string; render?: (item: Company) => React.ReactNode }[] = [
    { key: 'nome', header: 'Nome' },
    { key: 'cnpj', header: 'CNPJ', render: (item) => item.cnpj || 'N/A' },
    { key: 'cpf', header: 'CPF', render: (item) => item.cpf || 'N/A' },
    { key: 'emailResponsavel', header: 'Email Responsável' },
    { key: 'planoContratado', header: 'Plano' },
    { key: 'estadoPagamento', header: 'Estado Pag.', render: (item) => item.estadoPagamento === 0 ? 'OK' : 'Pendente' },
  ];

  return (
    <div className="space-y-6">
      <header className="pb-4 border-b border-futuristic-primary/20">
        <h1 className="text-3xl font-orbitron text-futuristic-primary">Gerenciar Empresas</h1>
        <p className="mt-1 text-md text-futuristic-text-secondary">Crie novas empresas e visualize as existentes.</p>
      </header>

      <Card title="Criar Nova Empresa">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nome da Empresa" name="nome" value={formData.nome} onChange={handleChange} required />
            <Input label="Email do Responsável" name="emailResponsavel" type="email" value={formData.emailResponsavel} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="CNPJ (Opcional)" name="cnpj" value={formData.cnpj || ''} onChange={handleChange} />
            <Input label="CPF (Opcional, se não houver CNPJ)" name="cpf" value={formData.cpf || ''} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Nome do Responsável (Opcional)" name="nomeResponsavel" value={formData.nomeResponsavel || ''} onChange={handleChange} />
            <div>
              <label htmlFor="planoContratado" className="block text-sm font-medium text-futuristic-text-secondary mb-1.5">Plano Contratado</label>
              <select
                id="planoContratado"
                name="planoContratado"
                value={formData.planoContratado}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-futuristic-bg-secondary border border-futuristic-primary/30 focus:border-futuristic-primary focus:ring-1 focus:ring-futuristic-primary focus:outline-none text-futuristic-text"
              >
                <option value="BASIC">BASIC</option>
                <option value="PRO">PRO</option>
                <option value="ENTERPRISE">ENTERPRISE</option>
              </select>
            </div>
            <div>
              <label htmlFor="estadoPagamento" className="block text-sm font-medium text-futuristic-text-secondary mb-1.5">Estado Pagamento</label>
              <select
                id="estadoPagamento"
                name="estadoPagamento"
                value={formData.estadoPagamento}
                onChange={(e) => setFormData(prev => ({...prev, estadoPagamento: parseInt(e.target.value)}))}
                className="w-full px-3 py-2.5 rounded-lg bg-futuristic-bg-secondary border border-futuristic-primary/30 focus:border-futuristic-primary focus:ring-1 focus:ring-futuristic-primary focus:outline-none text-futuristic-text"
              >
                <option value={0}>OK</option>
                <option value={1}>Pendente</option>
              </select>
            </div>
          </div>
          
          <Button 
            type="submit" 
            isLoading={isLoading} 
            disabled={isLoading}
            leftIcon={<Icons.PlusCircle className="w-5 h-5"/>}
            className="w-full md:w-auto"
          >
            Criar Empresa
          </Button>
        </form>
      </Card>

      <Card title="Empresas Cadastradas">
        {isFetching && <Spinner />}
        {!isFetching && companies.length === 0 && (
          <p className="text-center text-futuristic-text-secondary py-4">Nenhuma empresa cadastrada ou falha ao carregar.</p>
        )}
        {!isFetching && companies.length > 0 && (
          <Table columns={columns} data={companies} keyExtractor={(item) => item.id || item.nome} />
        )}
      </Card>
    </div>
  );
};

export default ManageCompaniesPage;
