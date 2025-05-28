
import React, { useState, useCallback, useEffect } from 'react';
import { apiService } from '../../../services/apiService';
import { User, CreateUserPayload, Company, ApiError, UserModo } from '../../../types';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Card from '../../common/Card';
import Spinner from '../../common/Spinner';
import Table from '../../common/Table';
import { Icons } from '../../../constants';
import toast from 'react-hot-toast';

const USER_MODOS: UserModo[] = ["CHAT", "AGENDA"]; // Define available modes

const initialFormData: CreateUserPayload = {
  nome: '',
  username: '',
  empresa: '', // Will be company name
  nascimento: '', // YYYY-MM-DD
  email: '',
  telefone: '',
  senha: '',
  tipo: '0', // Default type
  cpf: '',
  ativo: false,
  modos: [],
};

const ManageUsersPage: React.FC = () => {
  const [formData, setFormData] = useState<CreateUserPayload>(initialFormData);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedModos, setSelectedModos] = useState<Set<UserModo>>(new Set());

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);
  const [isFetchingCompanies, setIsFetchingCompanies] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsFetchingUsers(true);
    try {
      const data = await apiService.getUsers();
      setUsers(data || []);
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Falha ao buscar usuários.');
      setUsers([]);
    } finally {
      setIsFetchingUsers(false);
    }
  }, []);

  const fetchCompanies = useCallback(async () => {
    setIsFetchingCompanies(true);
    try {
      const data = await apiService.getCompanies();
      setCompanies(data || []);
      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, empresa: data[0].nome })); // Default to first company
      }
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Falha ao buscar empresas para seleção.');
      setCompanies([]);
    } finally {
      setIsFetchingCompanies(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, [fetchUsers, fetchCompanies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name !== 'ativo') { // Special handling for 'modos'
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleModoChange = (modo: UserModo) => {
    setSelectedModos(prev => {
      const newSelectedModos = new Set(prev);
      if (newSelectedModos.has(modo)) {
        newSelectedModos.delete(modo);
      } else {
        newSelectedModos.add(modo);
      }
      return newSelectedModos;
    });
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.empresa) {
        toast.error("Por favor, selecione uma empresa.");
        return;
    }
    setIsLoading(true);
    setError(null);
    
    const payload: CreateUserPayload = {
      ...formData,
      modos: Array.from(selectedModos),
    };

    try {
      await apiService.createUser(payload);
      toast.success(`Usuário "${payload.nome}" criado com sucesso!`);
      setFormData(initialFormData); // Reset form
      setSelectedModos(new Set());
      if (companies.length > 0) { // Reset empresa to first company if available
        setFormData(prev => ({ ...prev, empresa: companies[0].nome }));
      }
      fetchUsers(); // Refresh the list
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Falha ao criar usuário.');
      setError(apiErr.message);
    } finally {
      setIsLoading(false);
    }
  }, [formData, selectedModos, fetchUsers, companies]);

  const userColumns: { key: keyof User | string; header: string; render?: (item: User) => React.ReactNode }[] = [
    { key: 'nome', header: 'Nome' },
    { key: 'username', header: 'Username' },
    { key: 'email', header: 'Email' },
    { key: 'empresa', header: 'Empresa' },
    { key: 'telefone', header: 'Telefone' },
    { key: 'ativo', header: 'Ativo', render: (item) => item.ativo ? <span className="text-green-400">Sim</span> : <span className="text-red-400">Não</span> },
    { key: 'modos', header: 'Modos', render: (item) => item.modos.join(', ') },
  ];

  return (
    <div className="space-y-6">
      <header className="pb-4 border-b border-futuristic-primary/20">
        <h1 className="text-3xl font-orbitron text-futuristic-primary">Gerenciar Usuários</h1>
        <p className="mt-1 text-md text-futuristic-text-secondary">Crie novos usuários e associe-os a empresas.</p>
      </header>

      <Card title="Criar Novo Usuário">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nome Completo" name="nome" value={formData.nome} onChange={handleChange} required />
            <Input label="Username" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} required />
            <Input label="Data de Nascimento" name="nascimento" type="date" value={formData.nascimento} onChange={handleChange} required />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Senha" name="senha" type="password" value={formData.senha} onChange={handleChange} required />
            <div>
                <label htmlFor="empresa" className="block text-sm font-medium text-futuristic-text-secondary mb-1.5">Empresa</label>
                {isFetchingCompanies ? <Spinner size="sm"/> : (
                <select
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 rounded-lg bg-futuristic-bg-secondary border border-futuristic-primary/30 focus:border-futuristic-primary focus:ring-1 focus:ring-futuristic-primary focus:outline-none text-futuristic-text"
                >
                    <option value="" disabled>Selecione uma empresa</option>
                    {companies.map(comp => <option key={comp.id || comp.nome} value={comp.nome}>{comp.nome}</option>)}
                </select>
                )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-futuristic-text-secondary mb-1.5">Tipo de Usuário</label>
                <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-futuristic-bg-secondary border border-futuristic-primary/30 focus:border-futuristic-primary focus:ring-1 focus:ring-futuristic-primary focus:outline-none text-futuristic-text">
                    <option value="0">Admin</option>
                    <option value="1">Usuário Padrão</option>
                </select>
            </div>
            <div className="flex items-center space-x-3 pt-6">
                 <input type="checkbox" id="ativo" name="ativo" checked={formData.ativo} onChange={handleChange} className="h-5 w-5 rounded text-futuristic-primary bg-futuristic-bg-secondary border-futuristic-primary/50 focus:ring-futuristic-accent"/>
                 <label htmlFor="ativo" className="text-sm text-futuristic-text">Usuário Ativo</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-futuristic-text-secondary mb-1.5">Modos de Acesso</label>
            <div className="flex flex-wrap gap-4">
                {USER_MODOS.map(modo => (
                    <div key={modo} className="flex items-center">
                        <input 
                            type="checkbox" 
                            id={`modo-${modo}`} 
                            name={`modo-${modo}`}
                            checked={selectedModos.has(modo)} 
                            onChange={() => handleModoChange(modo)}
                            className="h-4 w-4 rounded text-futuristic-primary bg-futuristic-bg-secondary border-futuristic-primary/50 focus:ring-futuristic-accent"
                        />
                        <label htmlFor={`modo-${modo}`} className="ml-2 text-sm text-futuristic-text">{modo}</label>
                    </div>
                ))}
            </div>
          </div>
          
          <Button 
            type="submit" 
            isLoading={isLoading} 
            disabled={isLoading || isFetchingCompanies || companies.length === 0}
            leftIcon={<Icons.PlusCircle className="w-5 h-5"/>}
            className="w-full md:w-auto"
          >
            {companies.length === 0 && !isFetchingCompanies ? "Cadastre uma Empresa Primeiro" : "Criar Usuário"}
          </Button>
        </form>
      </Card>

      <Card title="Usuários Cadastrados">
        {isFetchingUsers && <Spinner />}
        {!isFetchingUsers && users.length === 0 && (
          <p className="text-center text-futuristic-text-secondary py-4">Nenhum usuário cadastrado ou falha ao carregar.</p>
        )}
        {!isFetchingUsers && users.length > 0 && (
          <Table columns={userColumns} data={users} keyExtractor={(item) => item.id || item.username} />
        )}
      </Card>
    </div>
  );
};

export default ManageUsersPage;
