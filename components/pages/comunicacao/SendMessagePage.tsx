
import React, { useState, useCallback, useEffect } from 'react';
import { apiService } from '../../../services/apiService';
import { FetchedInstanceConnection, SendTextMessagePayload, SendTextMessageResponse, ApiError } from '../../../types';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Card from '../../common/Card';
import Spinner from '../../common/Spinner';
import { Icons } from '../../../constants';
import toast from 'react-hot-toast';

const SendMessagePage: React.FC = () => {
  const [instances, setInstances] = useState<FetchedInstanceConnection[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [recipientNumber, setRecipientNumber] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingInstances, setIsLoadingInstances] = useState<boolean>(true);
  const [messageResponse, setMessageResponse] = useState<SendTextMessageResponse | null>(null);

  const fetchOpenInstances = useCallback(async () => {
    setIsLoadingInstances(true);
    try {
      const allInstances = await apiService.getInstanceConnections();
      const openInstances = allInstances.filter(inst => inst.connectionStatus === 'open');
      setInstances(openInstances);
      if (openInstances.length > 0) {
        setSelectedInstance(openInstances[0].name); 
      } else {
        toast.error("Nenhuma instância 'open' encontrada. Por favor, verifique suas conexões.", { duration: 4000 });
      }
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Falha ao buscar instâncias conectadas.');
    } finally {
      setIsLoadingInstances(false);
    }
  }, []);

  useEffect(() => {
    fetchOpenInstances();
  }, [fetchOpenInstances]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstance) {
      toast.error('Por favor, selecione uma instância.');
      return;
    }
    if (!recipientNumber.trim()) {
      toast.error('Por favor, insira o número do destinatário.');
      return;
    }
    if (!messageText.trim()) {
      toast.error('Por favor, insira o texto da mensagem.');
      return;
    }

    setIsLoading(true);
    setMessageResponse(null);
    const payload: SendTextMessagePayload = {
      number: recipientNumber,
      text: messageText,
    };

    try {
      const response = await apiService.sendTextMessage(selectedInstance, payload);
      setMessageResponse(response);
      toast.success(response.message || 'Mensagem enviada com sucesso!');
      // setRecipientNumber(''); // Commented out to allow sending multiple messages easily
      // setMessageText('');
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Falha ao enviar mensagem.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedInstance, recipientNumber, messageText]);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
  };

  return (
    <div className="space-y-6">
      <header className="pb-4 border-b border-futuristic-primary/20">
        <h1 className="text-3xl font-orbitron text-futuristic-primary">Enviar Mensagem de Texto</h1>
        <p className="mt-1 text-md text-futuristic-text-secondary">Selecione uma instância, insira o destinatário e a mensagem.</p>
      </header>

      <Card>
        {isLoadingInstances ? (
          <Spinner />
        ) : instances.length === 0 ? (
          <p className="text-center text-futuristic-text-secondary">Nenhuma instância com status "open" disponível para envio. Verifique a página "Gerenciar Instâncias".</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="instance-select" className="block text-sm font-medium text-futuristic-text-secondary mb-1.5">
                Selecionar Instância (Status: Open)
              </label>
              <select
                id="instance-select"
                value={selectedInstance}
                onChange={(e) => setSelectedInstance(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-futuristic-bg-secondary border border-futuristic-primary/30 focus:border-futuristic-primary focus:ring-1 focus:ring-futuristic-primary focus:outline-none placeholder-futuristic-text-secondary/70 transition-colors duration-200 ease-in-out shadow-sm text-futuristic-text"
                disabled={isLoading}
              >
                {instances.map(inst => (
                  <option key={inst.id || inst.name} value={inst.name}>
                    {inst.name} ({inst.profileName || inst.number || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Número do Destinatário (ex: 5511912345678)"
              name="recipientNumber"
              value={recipientNumber}
              onChange={(e) => setRecipientNumber(e.target.value)}
              placeholder="Insira o número completo com DDI e DDD"
              required
              disabled={isLoading}
            />
            
            <div>
              <label htmlFor="messageText" className="block text-sm font-medium text-futuristic-text-secondary mb-1.5">
                Texto da Mensagem
              </label>
              <textarea
                id="messageText"
                name="messageText"
                rows={4}
                value={messageText}
                onChange={handleTextAreaChange}
                className="w-full px-4 py-2.5 rounded-lg bg-futuristic-bg-secondary border border-futuristic-primary/30 focus:border-futuristic-primary focus:ring-1 focus:ring-futuristic-primary focus:outline-none placeholder-futuristic-text-secondary/70 transition-colors duration-200 ease-in-out shadow-sm text-futuristic-text"
                placeholder="Digite sua mensagem aqui..."
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              isLoading={isLoading} 
              disabled={isLoading || instances.length === 0}
              leftIcon={<Icons.PaperAirplane className="w-5 h-5"/>}
              className="w-full md:w-auto"
            >
              Enviar Mensagem
            </Button>
          </form>
        )}
      </Card>

      {messageResponse && (
        <Card title="Resposta do Envio">
          <pre className="bg-futuristic-bg p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(messageResponse, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default SendMessagePage;
