
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './components/pages/DashboardPage';

// Agendamentos Module
import EstimativaValorPage from './components/pages/agendamentos/EstimativaValorPage';
import UploadCsvPage from './components/pages/agendamentos/UploadCsvPage';
import AgendamentosPage from './components/pages/agendamentos/AgendamentosPage';
import EstatisticasPage from './components/pages/agendamentos/EstatisticasPage';

// Comunicação Module
import CreateInstancePage from './components/pages/comunicacao/CreateInstancePage';
import SendMessagePage from './components/pages/comunicacao/SendMessagePage';
import InstancesPage from './components/pages/comunicacao/InstancesPage';

// Configurações Module
import ManageCompaniesPage from './components/pages/configuracoes/ManageCompaniesPage';
import ManageUsersPage from './components/pages/configuracoes/ManageUsersPage';

import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex h-screen bg-futuristic-bg text-futuristic-text">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Agendamentos Module Routes */}
            <Route path="/agendamentos" element={<Navigate to="/agendamentos/upload-csv" replace />} />
            <Route path="/agendamentos/estimativa-valor" element={<EstimativaValorPage />} />
            <Route path="/agendamentos/upload-csv" element={<UploadCsvPage />} />
            <Route path="/agendamentos/lista" element={<AgendamentosPage />} />
            <Route path="/agendamentos/estatisticas" element={<EstatisticasPage />} />
            
            {/* Comunicação Module Routes */}
            <Route path="/comunicacao" element={<Navigate to="/comunicacao/enviar-mensagem" replace />} />
            <Route path="/comunicacao/criar-instancia" element={<CreateInstancePage />} />
            <Route path="/comunicacao/enviar-mensagem" element={<SendMessagePage />} />
            <Route path="/comunicacao/gerenciar-instancias" element={<InstancesPage />} />

            {/* Configurações Module Routes */}
            <Route path="/configuracoes" element={<Navigate to="/configuracoes/empresas" replace />} />
            <Route path="/configuracoes/empresas" element={<ManageCompaniesPage />} />
            <Route path="/configuracoes/usuarios" element={<ManageUsersPage />} />
            
          </Routes>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            background: '#161B22', 
            color: '#E0E0E0', 
            border: '1px solid #00A9FF', 
          },
          success: {
            iconTheme: {
              primary: '#00E5FF', 
              secondary: '#161B22',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF3D71', 
              secondary: '#161B22',
            },
          },
        }}
      />
    </HashRouter>
  );
};

export default App;
