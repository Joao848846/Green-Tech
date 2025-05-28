import React from "react";
import Card from "../common/Card";
import { Icons } from "../../constants";

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="pb-6 border-b border-futuristic-primary/20">
        <h1 className="text-4xl font-orbitron text-futuristic-primary">
          Dashboard Principal
        </h1>
        <p className="mt-2 text-lg text-futuristic-text-secondary">
          Bem-vindo ao seu centro de controle.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Visão Geral"
          className="hover:shadow-futuristic-primary/30 transition-shadow duration-300"
        >
          <p className="text-futuristic-text-secondary">
            Acompanhe métricas chave e navegue pelas funcionalidades do sistema.
            Utilize o menu lateral para acessar as diferentes seções.
          </p>
        </Card>

        <Card
          title="Ações Rápidas"
          className="hover:shadow-futuristic-primary/30 transition-shadow duration-300"
        >
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <Icons.Upload className="w-5 h-5 text-futuristic-accent" />
              <span>Upload de CSVs para processamento.</span>
            </li>
            <li className="flex items-center space-x-3">
              <Icons.PlusCircle className="w-5 h-5 text-futuristic-accent" />
              <span>Criação e gerenciamento de instâncias.</span>
            </li>
            <li className="flex items-center space-x-3">
              <Icons.ChartBar className="w-5 h-5 text-futuristic-accent" />
              <span>Visualização de estatísticas e agendamentos.</span>
            </li>
          </ul>
        </Card>

        <Card
          title="Status do Sistema"
          className="hover:shadow-futuristic-primary/30 transition-shadow duration-300"
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-fast"></div>
            <p className="text-futuristic-text-secondary">
              Todos os sistemas operacionais.
            </p>
          </div>
          <p className="mt-2 text-xs text-futuristic-text-secondary/70">
            Última verificação: {new Date().toLocaleTimeString()}
          </p>
        </Card>
      </div>

      <Card
        title="Próximos Passos"
        className="hover:shadow-futuristic-primary/30 transition-shadow duration-300"
      >
        <p className="text-futuristic-text-secondary">
          Explore as seções de "Estimativa de Valor" para análises financeiras
          ou "Agendamentos" para gerenciar compromissos. As "Estatísticas"
          oferecem insights valiosos sobre pagamentos.
        </p>
      </Card>
    </div>
  );
};

export default DashboardPage;
