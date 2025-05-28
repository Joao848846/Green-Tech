import React, { useState, useCallback, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { FetchedInstanceConnection, ApiError } from '../../types'; // Updated type
import Button from '../common/Button';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import { Icons } from '../../constants';
import Input from '../common/Input';
import toast from 'react-hot-toast';

const InstancesPage: React.FC = () => {
  const [instances, setInstances] = useState<FetchedInstanceConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [instanceToDelete, setInstanceToDelete] = useState('');

  const fetchInstances = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getInstanceConnections();
      setInstances(data);
      toast.success('Instâncias conectadas carregadas.');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Falha ao buscar instâncias.');
      toast.error(apiErr.message || 'Falha ao buscar instâncias.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleDeleteInstance = useCallback(async () => {
    if (!instanceToDelete) {
      toast.error('Por favor, insira o nome da instância para deletar.');
      return;
    }
    
    const confirmed = window.confirm(`Tem certeza que deseja deletar a instância "${instanceToDelete}"? Esta ação não pode ser desfeita.`);
    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      await apiService.deleteInstance(instanceToDelete);
      toast.success(`Instância "${instanceToDelete}" deletada com sucesso.`);
      setInstanceToDelete('');
      fetchInstances(); 
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || `Falha ao deletar instância "${instanceToDelete}".`);
    } finally {
      setIsLoading(false);
    }
  }, [instanceToDelete, fetchInstances]);

  return (
    <div className="space-y-6">
      <header className="pb-4 border-b border-futuristic-primary/20">
        <h1 className="text-3xl font-orbitron text-futuristic-primary">Gerenciamento de Instâncias</h1>
        <p className="mt-1 text-md text-futuristic-text-secondary">Visualize conexões ativas e gerencie suas instâncias.</p>
      </header>

      <Card title="Deletar Instância">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <Input
            label="Nome da Instância para Deletar"
            value={instanceToDelete}
            onChange={(e) => setInstanceToDelete(e.target.value)}
            placeholder="Digite o nome exato da instância"
            className="flex-grow"
          />
          <Button 
            onClick={handleDeleteInstance} 
            isLoading={isLoading && !!instanceToDelete} 
            disabled={isLoading || !instanceToDelete}
            variant="danger"
            leftIcon={<Icons.Trash className="w-5 h-5"/>}
          >
            Deletar Instância
          </Button>
        </div>
      </Card>
      
      <Card title="Instâncias Conectadas">
        {isLoading && !instanceToDelete && <Spinner />} 
        {!isLoading && instances.length === 0 && (
          <p className="text-center text-futuristic-text-secondary py-4">Nenhuma instância conectada encontrada.</p>
        )}
        {!isLoading && instances.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instances.map((conn) => (
              <Card 
                key={conn.id || conn.name} // Use conn.id if available, fallback to name
                title={conn.name} 
                className="bg-futuristic-bg border border-futuristic-primary/30 hover:shadow-futuristic-primary/20 transition-shadow"
                titleClassName="text-futuristic-accent"
              >
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-futuristic-text-secondary">Status:</span> <span className={`font-bold ${conn.connectionStatus === 'open' ? 'text-green-400' : 'text-yellow-400'}`}>{conn.connectionStatus}</span></p>
                  {conn.ownerJid && <p><span className="font-semibold text-futuristic-text-secondary">Owner JID:</span> {conn.ownerJid}</p>}
                  {conn.profileName && <p><span className="font-semibold text-futuristic-text-secondary">Perfil:</span> {conn.profileName}</p>}
                  {conn.number && <p><span className="font-semibold text-futuristic-text-secondary">Número:</span> {conn.number}</p>}
                  
                  {/* QR Code display removed as 'qrcode' field is not in FetchedInstanceConnection based on provided example */}
                  {/* If API for /instances/conection can return qrcode, add it to FetchedInstanceConnection and uncomment similar logic below */}
                  {/* {conn.qrcode?.base64 && conn.connectionStatus !== 'open' && ( ... ) } */}

                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default InstancesPage;
