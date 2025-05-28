import React, { useState, useCallback, useEffect } from "react";
import { apiService } from "../../../services/apiService";
import { Agendamento, ApiError } from "../../../types";
import Button from "../../common/Button";
import Input from "../../common/Input";
import Card from "../../common/Card";
import Spinner from "../../common/Spinner";
import Table from "../../common/Table";
import { Icons } from "../../../constants";
import toast from "react-hot-toast";

type SearchType = "all" | "telefone" | "status" | "documento";

const AgendamentosPage: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const [searchType, setSearchType] = useState<SearchType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "pendente" | "pago" | "atrasado" | "cancelado" | ""
  >("");

  const fetchAgendamentos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAgendamentos([]);
    try {
      let data: any[] = [];
      if (searchType === "all") {
        data = await apiService.getAllAgendamentos();
        toast.success("Todos os agendamentos carregados.");
      } else if (searchType === "telefone" && searchTerm) {
        const result = await apiService.getAgendamentosByTelefone(searchTerm);
        data = Array.isArray(result) ? result : result ? [result] : [];
        toast.success(`Agendamentos para o telefone ${searchTerm} carregados.`);
      } else if (searchType === "status" && statusFilter) {
        data = await apiService.getAgendamentosByStatus(statusFilter);
        toast.success(`Agendamentos com status ${statusFilter} carregados.`);
      } else if (searchType === "documento" && searchTerm) {
        const result = await apiService.getAgendamentosByDocumento(searchTerm);
        data = Array.isArray(result) ? result : result ? [result] : [];
        toast.success(
          `Agendamentos para o documento ${searchTerm} carregados.`
        );
      } else if (
        (searchType === "telefone" || searchType === "documento") &&
        !searchTerm
      ) {
        toast.error("Por favor, insira um termo de busca.");
        setIsLoading(false);
        return;
      } else if (searchType === "status" && !statusFilter) {
        toast.error("Por favor, selecione um status.");
        setIsLoading(false);
        return;
      }
      setAgendamentos(data);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Falha ao buscar agendamentos.");
      toast.error(apiErr.message || "Falha ao buscar agendamentos.");
    } finally {
      setIsLoading(false);
    }
  }, [searchType, searchTerm, statusFilter]);

  useEffect(() => {
    if (searchType === "all") {
      fetchAgendamentos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType]);

  const columns: {
    key: string;
    header: string;
    render?: (item: any) => React.ReactNode;
  }[] = [
    { key: "nome", header: "Cliente" },
    { key: "telefone", header: "Telefone" },
    {
      key: "documento",
      header: "Documento",
      render: (item) =>
        item.documento && item.documento.length > 3
          ? `${item.documento.slice(0, 3)}***`
          : item.documento || "-",
    },
    {
      key: "data_contrato",
      header: "Data",
      render: (item) =>
        item.data_contrato
          ? new Date(item.data_contrato).toLocaleDateString("pt-BR")
          : "-",
    },
    {
      key: "tipo_contrato",
      header: "Serviço",
    },
    {
      key: "valor_mensalidade",
      header: "Valor Mensalidade",
      render: (item) => item.valor_mensalidade || "-",
    },
    {
      key: "statusPagamento",
      header: "Status Pag.",
      render: (item) => {
        let colorClass = "";
        switch (item.statusPagamento) {
          case "pago":
            colorClass = "text-green-400";
            break;
          case "pendente":
            colorClass = "text-yellow-400";
            break;
          case "atrasado":
            colorClass = "text-red-400";
            break;
          case "cancelado":
            colorClass = "text-gray-500";
            break;
          default:
            colorClass = "";
        }
        return (
          <span
            className={`font-semibold px-2 py-1 rounded-full bg-opacity-20 ${colorClass.replace(
              "text-",
              "bg-"
            )} ${colorClass}`}
          >
            {item.statusPagamento}
          </span>
        );
      },
    },
    {
      key: "lembreteEnviado",
      header: "Lembrete Enviado",
      render: (item) => (item.lembreteEnviado ? "Sim" : "Não"),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="pb-4 border-b border-futuristic-primary/20">
        <h1 className="text-3xl font-orbitron text-futuristic-primary">
          Gerenciamento de Agendamentos
        </h1>
        <p className="mt-1 text-md text-futuristic-text-secondary">
          Visualize e filtre os agendamentos do sistema.
        </p>
      </header>

      <Card title="Filtros de Busca">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label
                htmlFor="searchType"
                className="block text-sm font-medium text-futuristic-text-secondary mb-1.5"
              >
                Tipo de Busca
              </label>
              <select
                id="searchType"
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value as SearchType);
                  setSearchTerm("");
                  setStatusFilter("");
                  if (e.target.value !== "all") {
                    setAgendamentos([]);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-lg bg-futuristic-bg-secondary border border-futuristic-primary/30 focus:border-futuristic-primary focus:ring-1 focus:ring-futuristic-primary focus:outline-none text-futuristic-text"
              >
                <option value="all">Todos Agendamentos</option>
                <option value="telefone">Por Telefone</option>
                <option value="status">Por Status Pagamento</option>
                <option value="documento">Por Documento</option>
              </select>
            </div>

            {(searchType === "telefone" || searchType === "documento") && (
              <Input
                label={`Buscar por ${
                  searchType === "telefone" ? "Telefone" : "Documento"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  searchType === "telefone" ? "Ex: 55119..." : "Ex: 12345678901"
                }
                className="md:col-span-2"
              />
            )}

            {searchType === "status" && (
              <div>
                <label
                  htmlFor="statusFilter"
                  className="block text-sm font-medium text-futuristic-text-secondary mb-1.5"
                >
                  Status
                </label>
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
              disabled={
                isLoading ||
                (searchType !== "all" &&
                  !searchTerm &&
                  searchType !== "status") ||
                (searchType === "status" && !statusFilter)
              }
              leftIcon={<Icons.Search className="w-5 h-5" />}
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
            keyExtractor={(item) =>
              `${item.documento}-${item.data_contrato}-${item.tipo_contrato}`
            }
          />
        </Card>
      )}
      {!isLoading &&
        agendamentos.length === 0 &&
        searchType !== "all" &&
        (searchTerm || statusFilter) && (
          <Card>
            <p className="text-center text-futuristic-text-secondary py-4">
              Nenhum agendamento encontrado para os critérios de busca.
            </p>
          </Card>
        )}
    </div>
  );
};

export default AgendamentosPage;
