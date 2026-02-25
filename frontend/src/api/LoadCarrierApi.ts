import type { HttpFn } from '../hooks/useHttp'

export interface LoadCarrierDto {
  id: number;
  name: string;
  description?: string;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateLoadCarrierDto {
  name: string;
  description?: string;
}

export interface UpdateLoadCarrierDto {
  name: string;
  description?: string;
}

export const LoadCarrierApi = {
  getAll: (http: HttpFn): Promise<LoadCarrierDto[]> => 
    http<LoadCarrierDto[]>('/api/load-carriers'),

  getById: (http: HttpFn, id: number): Promise<LoadCarrierDto> =>
    http<LoadCarrierDto>(`/api/load-carriers/${id}`),

  create: (http: HttpFn, payload: CreateLoadCarrierDto): Promise<LoadCarrierDto> =>
    http<LoadCarrierDto>('/api/load-carriers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (http: HttpFn, id: number, payload: UpdateLoadCarrierDto): Promise<LoadCarrierDto> =>
    http<LoadCarrierDto>(`/api/load-carriers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  remove: (http: HttpFn, id: number): Promise<void> =>
    http<void>(`/api/load-carriers/${id}`, {
      method: 'DELETE',
    }),
};