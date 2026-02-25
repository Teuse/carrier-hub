import type { HttpFn } from '../hooks/useHttp'
import type { LoadCarrierRequestDto } from './types';

export const LoadCarrierRequestApi = {
  /* Warehouse + Logistics view */
  getAll: (http: HttpFn): Promise<LoadCarrierRequestDto[]> =>
    http<LoadCarrierRequestDto[]>('/api/requests'),

  /* Status transition */
  advance: (http: HttpFn, id: number): Promise<LoadCarrierRequestDto> =>
    http<LoadCarrierRequestDto>(`/api/requests/${id}/advance`, {
      method: 'POST',
    }),
};