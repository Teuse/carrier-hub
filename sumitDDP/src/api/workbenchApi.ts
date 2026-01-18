import { http } from './http';
import type {
  WorkbenchDto,
  LoadCarrierRequestDto,
  CreateLoadCarrierRequestDto,
} from './types';

export const WorkbenchApi = {
  /* ===================================================== */
  /* Selection / Runtime                                  */
  /* ===================================================== */

  getActive: (): Promise<WorkbenchDto[]> =>
    http('/api/workbenches'),

  getRequests: (
    workbenchId: number
  ): Promise<LoadCarrierRequestDto[]> =>
    http(`/api/workbenches/${workbenchId}/requests`),

  requestNew: (
    workbenchId: number,
    payload: CreateLoadCarrierRequestDto
  ): Promise<LoadCarrierRequestDto> =>
    http(`/api/workbenches/${workbenchId}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  /* ===================================================== */
  /* Management / Admin                                   */
  /* ===================================================== */

  getAll: (): Promise<WorkbenchDto[]> =>
    http('/api/workbenches/all'),

  create: (
    name: string,
    description?: string
  ): Promise<WorkbenchDto> =>
    http('/api/workbenches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    }),

  deactivate: (id: number): Promise<WorkbenchDto> =>
    http(`/api/workbenches/${id}/deactivate`, {
      method: 'POST',
    }),
};