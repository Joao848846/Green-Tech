
import { API_BASE_URL } from '../constants';
import { 
  EstimativaValor, 
  CreateInstancePayload, 
  FetchedInstanceConnection,
  Agendamento, 
  PagamentosPorStatusData, 
  ApiError,
  SendTextMessagePayload,
  SendTextMessageResponse,
  Company,
  CreateCompanyPayload,
  User,
  CreateUserPayload
} from '../types';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText };
    }
    const error: ApiError = {
      message: errorData?.message || `API Error: ${response.status}`,
      status: response.status,
      details: errorData,
    };
    console.error("API Error:", error); // Log for debugging
    throw error;
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const text = await response.text();
    if (text.length === 0) { // Handle truly empty response
        // For specific cases that might return 200 OK with no content, but it's not typical for GETs.
        // For DELETE it's more common to get 204 No Content.
        return {} as T; // Return an empty object or handle as appropriate
    }
    try {
      return JSON.parse(text) as T;
    } catch (e) {
      console.error("Failed to parse JSON response:", text, e);
      throw { message: "Invalid JSON response from server." } as ApiError;
    }
  }
  // For 204 No Content (typically for DELETE, PUT, POST if no body is returned)
  if (response.status === 204) return { success: true, message: "Operation successful (204 No Content)." } as unknown as T;
  
  // Fallback for non-JSON, non-204 responses (e.g. plain text success message)
  // This part might need adjustment based on actual API behavior for non-JSON success.
  const textResponse = await response.text();
  return { data: textResponse } as unknown as T; // Or handle as appropriate
}


export const apiService = {
  getEstimativaValor: async (dataInicial: string, dataFinal: string): Promise<EstimativaValor> => {
    const response = await fetch(`${API_BASE_URL}/csv/estimativa-valor?dataInicial=${dataInicial}&dataFinal=${dataFinal}`, {
      method: 'GET',
      headers: defaultHeaders,
      credentials: 'include', 
    });
    return handleResponse<EstimativaValor>(response);
  },

  uploadCsv: async (file: File): Promise<any> => { 
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/csv/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },

  createInstance: async (payload: CreateInstancePayload): Promise<any> => { 
    const response = await fetch(`${API_BASE_URL}/create/instance`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },

  getAgendamentosByTelefone: async (telefone: string): Promise<Agendamento[]> => {
    const response = await fetch(`${API_BASE_URL}/csv/agendamentos/telefone?telefone=${telefone}`, {
      method: 'GET',
      headers: defaultHeaders,
      credentials: 'include',
    });
    return handleResponse<Agendamento[]>(response);
  },

  getAgendamentosByStatus: async (statusPagamento: string): Promise<Agendamento[]> => {
    const response = await fetch(`${API_BASE_URL}/csv/agendamentos/status_pagamento?status_pagamento=${statusPagamento}`, {
      method: 'GET',
      headers: defaultHeaders,
      credentials: 'include',
    });
    return handleResponse<Agendamento[]>(response);
  },
  
  getEstatisticasPagamentosPorStatus: async (): Promise<PagamentosPorStatusData> => {
    const response = await fetch(`${API_BASE_URL}/csv/estatisticas/pagamentos-por-status`, {
      method: 'GET',
      headers: defaultHeaders,
      credentials: 'include',
    });
    return handleResponse<PagamentosPorStatusData>(response);
  },

  getAgendamentosByDocumento: async (documento: string): Promise<Agendamento[]> => {
    const response = await fetch(`${API_BASE_URL}/csv/agendamentos/documento?documento=${documento}`, {
      method: 'GET',
      headers: defaultHeaders,
      credentials: 'include',
    });
    return handleResponse<Agendamento[]>(response);
  },

  getAllAgendamentos: async (): Promise<Agendamento[]> => {
    const response = await fetch(`${API_BASE_URL}/csv/agendamentos`, {
      method: 'GET',
      headers: defaultHeaders,
      credentials: 'include',
    });
    return handleResponse<Agendamento[]>(response);
  },

  getInstanceConnections: async (): Promise<FetchedInstanceConnection[]> => {
    const response = await fetch(`${API_BASE_URL}/instances/conection`, {
      method: 'GET',
      headers: defaultHeaders,
      credentials: 'include',
    });
    return handleResponse<FetchedInstanceConnection[]>(response);
  },

  deleteInstance: async (instanceName: string): Promise<any> => { 
    const response = await fetch(`${API_BASE_URL}/instances/delete/${encodeURIComponent(instanceName)}`, {
      method: 'DELETE',
      headers: defaultHeaders,
      credentials: 'include',
    });
    if (response.status === 204) return { success: true, message: "Instance deleted successfully." };
    // If not 204, but still ok, handleResponse will parse it.
    // If not ok, handleResponse will throw.
    return handleResponse<any>(response);
  },

  sendTextMessage: async (instanceName: string, payload: SendTextMessagePayload): Promise<SendTextMessageResponse> => {
    const response = await fetch(`${API_BASE_URL}/message/sendText/${encodeURIComponent(instanceName)}`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    return handleResponse<SendTextMessageResponse>(response);
  },

  // Company Endpoints
  createCompany: async (payload: CreateCompanyPayload): Promise<Company> => {
    const response = await fetch(`${API_BASE_URL}/companies/create`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    return handleResponse<Company>(response);
  },

  getCompanies: async (): Promise<Company[]> => {
    // Assuming an endpoint like GET /api/v1/companies exists
    // Mocking for now if it doesn't, to prevent UI errors.
    try {
        const response = await fetch(`${API_BASE_URL}/companies`, { // You might need to adjust this endpoint
            method: 'GET',
            headers: defaultHeaders,
            credentials: 'include',
        });
        return handleResponse<Company[]>(response);
    } catch (e) {
        console.warn("Could not fetch companies, GET /api/v1/companies might not be implemented. Returning empty array.", e);
        return []; // Return empty array on error or if endpoint doesn't exist
    }
  },

  // User Endpoints
  createUser: async (payload: CreateUserPayload): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/create`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    return handleResponse<User>(response);
  },

  getUsers: async (): Promise<User[]> => {
    // Assuming an endpoint like GET /api/v1/users exists
    // Mocking for now
    try {
        const response = await fetch(`${API_BASE_URL}/users`, { // You might need to adjust this endpoint
            method: 'GET',
            headers: defaultHeaders,
            credentials: 'include',
        });
        return handleResponse<User[]>(response);
    } catch (e) {
        console.warn("Could not fetch users, GET /api/v1/users might not be implemented. Returning empty array.", e);
        return [];
    }
  },
};
