
export interface EstimativaValor {
  pendente: number;
  pago: number;
  atrasado: number;
}

export interface CreateInstancePayload {
  instanceName: string;
  qrcode: boolean;
  number: string;
  integration: string;
  webhook: {
    enabled: boolean;
    url: string;
    events: string[];
  };
  chain: string;
}

export interface FetchedInstanceConnection {
  id: string;
  name: string; 
  connectionStatus: 'open' | 'connecting' | 'closed' | string; 
  ownerJid?: string;
  profileName?: string;
  profilePicUrl?: string;
  integration?: string;
  number?: string;
  [key: string]: any; 
}


export interface Agendamento {
  id?: string; 
  nome_cliente: string;
  telefone: string;
  documento: string;
  data_agendamento: string;
  hora_agendamento: string;
  servico: string;
  valor: number;
  status_pagamento: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  [key: string]: any;
}

export interface PagamentoPorStatus {
  status: string;
  count: number;
  total_valor?: number;
}
export type PagamentosPorStatusData = PagamentoPorStatus[];


export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface SendTextMessagePayload {
  number: string;
  text: string;
}

export interface SendTextMessageResponseData {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  pushName?: string; 
  message: {
    conversation?: string; 
    [key: string]: any; 
  };
  contextInfo: null | any; 
  messageType: string;
  messageTimestamp: number; 
  instanceId: string;
  source: string;
}

export interface SendTextMessageResponse {
  message: string; 
  data: SendTextMessageResponseData;
}

// New Types for Configurações Module

export type UserModo = "CHAT" | "AGENDA" | string; // Allow for other modes

export interface Company {
  id?: string;
  nome: string;
  cnpj: string | null;
  cpf: string | null;
  nomeResponsavel: string | null; // API returns null
  emailResponsavel: string;
  estadoPagamento: number;
  planoContratado: string;
}

export interface CreateCompanyPayload {
  nome: string;
  cnpj?: string | null;
  cpf?: string | null;
  nomeResponsavel?: string;
  emailResponsavel: string;
  estadoPagamento: number;
  planoContratado: string;
}

export interface User {
  id?: string;
  empresa: string; // Name of the company
  nome: string;
  username: string;
  nascimento: string; // YYYY-MM-DD
  email: string;
  telefone: string;
  senha?: string; // Not always returned
  tipo: string; // "0", "1" etc.
  cpf: string;
  ativo: boolean;
  modos: UserModo[];
}

export interface CreateUserPayload {
  nome: string;
  username: string;
  empresa: string; // Name of the company
  nascimento: string; // YYYY-MM-DD
  email: string;
  telefone: string;
  senha: string;
  tipo: string;
  cpf: string;
  ativo: boolean;
  modos: UserModo[];
}
