
import React, { useState, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import Button from '../common/Button';
import Card from '../common/Card';
import { Icons } from '../../constants';
import { ApiError } from '../../types';
import toast from 'react-hot-toast';

const UploadCsvPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadResponse, setUploadResponse] = useState<any | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecione um arquivo CSV para upload.');
      return;
    }
    setIsLoading(true);
    setUploadResponse(null);
    try {
      const response = await apiService.uploadCsv(selectedFile);
      setUploadResponse(response);
      toast.success(`Arquivo "${selectedFile.name}" enviado com sucesso!`);
      setSelectedFile(null); // Clear file input after successful upload
      // Optionally reset the file input element itself:
      const fileInput = document.getElementById('csv-upload-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Falha ao enviar arquivo CSV.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  return (
    <div className="space-y-6">
      <header className="pb-4 border-b border-futuristic-primary/20">
        <h1 className="text-3xl font-orbitron text-futuristic-primary">Upload de Arquivo CSV</h1>
        <p className="mt-1 text-md text-futuristic-text-secondary">Envie arquivos CSV para processamento no sistema.</p>
      </header>

      <Card title="Selecionar Arquivo">
        <div className="space-y-4">
          <div>
            <label htmlFor="csv-upload-input" className="block text-sm font-medium text-futuristic-text-secondary mb-1.5">
              Arquivo CSV
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-futuristic-primary/30 border-dashed rounded-md bg-futuristic-bg-secondary/30 hover:border-futuristic-primary transition-colors">
              <div className="space-y-1 text-center">
                <Icons.Upload className="mx-auto h-12 w-12 text-futuristic-text-secondary" />
                <div className="flex text-sm text-futuristic-text-secondary">
                  <label
                    htmlFor="csv-upload-input"
                    className="relative cursor-pointer rounded-md font-medium text-futuristic-accent hover:text-futuristic-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-futuristic-primary"
                  >
                    <span>Carregar um arquivo</span>
                    <input id="csv-upload-input" name="csv-upload-input" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-futuristic-text-secondary/70">Somente arquivos .csv</p>
              </div>
            </div>
          </div>
          
          {selectedFile && (
            <div className="text-sm text-futuristic-text-secondary">
              Arquivo selecionado: <span className="font-semibold text-futuristic-accent">{selectedFile.name}</span> ({(selectedFile.size / 1024).toFixed(2)} KB)
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            isLoading={isLoading} 
            disabled={!selectedFile || isLoading}
            leftIcon={<Icons.Upload className="w-5 h-5"/>}
            className="w-full md:w-auto"
          >
            Enviar Arquivo
          </Button>
        </div>
      </Card>

      {uploadResponse && (
        <Card title="Resposta do Servidor">
          <pre className="bg-futuristic-bg p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(uploadResponse, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default UploadCsvPage;
