import { http } from './http';
import type { LoadCarrierRequestDto } from './types';

export const LoadCarrierRequestApi = {
  /* Warehouse + Logistics view */
  getAll: (): Promise<LoadCarrierRequestDto[]> =>
    http('/api/requests'),

  /* Status transition */
  advance: (id: number): Promise<LoadCarrierRequestDto> =>
    http(`/api/requests/${id}/advance`, {
      method: 'POST',
    }),
};