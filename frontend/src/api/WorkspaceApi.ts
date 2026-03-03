import { http } from './http';
import type {
  WorkspaceDto,
  LoadCarrierRequestDto,
  CreateLoadCarrierRequestDto,
  AnomalyDto,
  CreateAnomalyDto,
  UpdateAnomalyDto,
} from './types';

export const WorkspaceApi = {
  /* ===================================================== */
  /* Selection / Runtime                                  */
  /* ===================================================== */

  getRequests: (
    workspaceId: number
  ): Promise<LoadCarrierRequestDto[]> =>
    http(`/api/workspaces/${workspaceId}/requests`),

  requestNew: (
    workspaceId: number,
    payload: CreateLoadCarrierRequestDto
  ): Promise<LoadCarrierRequestDto> =>
    http(`/api/workspaces/${workspaceId}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  getAllAnomalies: (): Promise<AnomalyDto[]> =>
    http('/api/anomalies'),

  getAnomalies: (
    workspaceId: number
  ): Promise<AnomalyDto[]> =>
    http(`/api/workspaces/${workspaceId}/anomalies`),

  reportAnomaly: (
    workspaceId: number,
    payload: CreateAnomalyDto
  ): Promise<AnomalyDto> =>
    http(`/api/workspaces/${workspaceId}/anomalies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  updateAnomaly: (
    anomalyId: number,
    payload: UpdateAnomalyDto
  ): Promise<AnomalyDto> =>
    http(`/api/anomalies/${anomalyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  deleteAnomaly: (anomalyId: number): Promise<void> =>
    http(`/api/anomalies/${anomalyId}`, {
      method: 'DELETE',
    }),

  /* ===================================================== */
  /* Management / Admin                                   */
  /* ===================================================== */

  getAll: (): Promise<WorkspaceDto[]> =>
    http('/api/workspaces'),

  create: (
    name: string,
    description?: string
  ): Promise<WorkspaceDto> =>
    http('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    }),

  update: (
    id: number,
    payload: { name: string; description?: string }
  ): Promise<WorkspaceDto> =>
    http(`/api/workspaces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
  }),

  delete: (id: number): Promise<void> =>
    http(`/api/workspaces/${id}`, {
      method: 'DELETE',
    })
};