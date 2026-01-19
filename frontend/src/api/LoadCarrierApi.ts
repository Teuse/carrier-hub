import { http } from './http';

export interface ItemDto {
  id: number;
  name: string;
  description?: string;
  count: number;
}

export interface LoadCarrierDto {
  id: number;
  name: string;
  description?: string;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  items: ItemDto[];
}

export interface CreateItemDto {
  name: string;
  description?: string;
  count: number;
}

export interface CreateLoadCarrierDto {
  name: string;
  description?: string;
  items: CreateItemDto[];
}

export interface UpdateLoadCarrierDto {
  name: string;
  description?: string;
  items: CreateItemDto[];
}

export const LoadCarrierApi = {
  getAll: (): Promise<LoadCarrierDto[]> => http('/api/load-carriers'),

  getById: (id: number): Promise<LoadCarrierDto> =>
    http(`/api/load-carriers/${id}`),

  create: (payload: CreateLoadCarrierDto): Promise<LoadCarrierDto> =>
    http('/api/load-carriers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: UpdateLoadCarrierDto): Promise<LoadCarrierDto> =>
    http(`/api/load-carriers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  remove: (id: number): Promise<void> =>
    http(`/api/load-carriers/${id}`, {
      method: 'DELETE',
    }),
};