
import React, { useState, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import { CreateInstancePayload, ApiError } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import { Icons } from '../../constants';
import toast from 'react-hot-toast';

const initialFormData: CreateInstancePayload = {
  instanceName: '',
  qrcode: true,
  number: '',
  integration: 'WHATSAPP-BAILEYS',
  webhook: {
    enabled: true,
    url: 'http://host.docker.internal:3000/webhook',
    events: [],
  },
  chain: 'bailes',
};

const CreateInstancePage: React.FC = () => {
  const [formData, setFormData] = useState<CreateInstancePayload>(initialFormData);
  const [webhookEventsInput, setWebhookEventsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [creationResponse, setCreationResponse] = useState<any | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('webhook.')) {
      const webhookKey = name.split('.')[1] as keyof CreateInstancePayload['webhook'];
      setFormData(prev => ({
        ...prev,
        webhook: {
          ...prev.webhook,
          [webhookKey]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };
  
  const handleWebhookEventsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookEventsInput(e.target.value);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCreationResponse(null);
    
    const payload: CreateInstancePayload = {
      ...formData,
      webhook: {
        ...formData.webhook,
        events: webhookEventsInput.split(',').map(event => event.trim()).filter(event => event.length > 0),
      }
    };

    try {
      const response = await apiService.createInstance(payload);
      setCreationResponse(response);
      toast.success(`Instância "${payload.instanceName}" criada com sucesso!`);
      setFormData(initialFormData); // Reset form
      setWebhookEventsInput('');
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Falha ao criar instância.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, webhookEventsInput]);

  return (
    <div className="space-y-6">
      <header className="pb-4 border-b border-futuristic-primary/20">
        <h1 className="text-3xl font-orbitron text-futuristic-primary">Criar Nova Instância</h1>
        <p className="mt-1 text-md text-futuristic-text-secondary">Configure e crie uma nova instância de serviço.</p>
      </header>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nome da Instância" name="instanceName" value={formData.instanceName} onChange={handleChange} required />
            <Input label="Número (ex: 5511912345678)" name="number" value={formData.number} onChange={handleChange} required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Integração" name="integration" value={formData.integration} onChange={handleChange} />
            <Input label="Chain" name="chain" value={formData.chain} onChange={handleChange} />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="qrcode"
              name="qrcode"
              checked={formData.qrcode}
              onChange={handleChange}
              className="h-5 w-5 rounded text-futuristic-primary bg-futuristic-bg-secondary border-futuristic-primary/50 focus:ring-futuristic-accent"
            />
            <label htmlFor="qrcode" className="text-sm text-futuristic-text">Habilitar QRCode</label>
          </div>

          <fieldset className="border border-futuristic-primary/30 p-4 rounded-lg">
            <legend className="px-2 text-lg font-orbitron text-futuristic-accent">Configuração do Webhook</legend>
            <div className="space-y-4 mt-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="webhook.enabled"
                  name="webhook.enabled"
                  checked={formData.webhook.enabled}
                  onChange={handleChange}
                  className="h-5 w-5 rounded text-futuristic-primary bg-futuristic-bg-secondary border-futuristic-primary/50 focus:ring-futuristic-accent"
                />
                <label htmlFor="webhook.enabled" className="text-sm text-futuristic-text">Habilitar Webhook</label>
              </div>
              {formData.webhook.enabled && (
                <>
                  <Input label="URL do Webhook" name="webhook.url" value={formData.webhook.url} onChange={handleChange} />
                  <Input 
                    label="Eventos do Webhook (separados por vírgula)" 
                    name="webhook.events" 
                    value={webhookEventsInput} 
                    onChange={handleWebhookEventsChange} 
                    placeholder="ex: message,ack,status"
                  />
                </>
              )}
            </div>
          </fieldset>
          
          <Button 
            type="submit" 
            isLoading={isLoading} 
            disabled={isLoading}
            leftIcon={<Icons.PlusCircle className="w-5 h-5"/>}
            className="w-full md:w-auto"
          >
            Criar Instância
          </Button>
        </form>
      </Card>

      {creationResponse && (
        <Card title="Resposta da Criação">
          <pre className="bg-futuristic-bg p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(creationResponse, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default CreateInstancePage;
