import type { HttpFn } from '../hooks/useHttp'
import type {
  WorkbenchDto,
  LoadCarrierRequestDto,
  CreateLoadCarrierRequestDto,
  AnomalyDto,
  CreateAnomalyDto,
  UpdateAnomalyDto,
} from './types';

export const WorkbenchApi = {
  /* ===================================================== */
  /* Selection / Runtime                                  */
  /* ===================================================== */

  getActive: (http: HttpFn): Promise<WorkbenchDto[]> =>
    http<WorkbenchDto[]>('/api/workbenches'),

  getRequests: (http: HttpFn, workbenchId: number): Promise<LoadCarrierRequestDto[]> =>
    http<LoadCarrierRequestDto[]>(`/api/workbenches/${workbenchId}/requests`),

  requestNew: (
    http: HttpFn, 
    workbenchId: number,
    payload: CreateLoadCarrierRequestDto
  ): Promise<LoadCarrierRequestDto> =>
    http<LoadCarrierRequestDto>(`/api/workbenches/${workbenchId}/requests`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getAllAnomalies: (http: HttpFn): Promise<AnomalyDto[]> =>
    http<AnomalyDto[]>('/api/anomalies'),

  getAnomalies: (http: HttpFn, workbenchId: number): Promise<AnomalyDto[]> =>
    http<AnomalyDto[]>(`/api/workbenches/${workbenchId}/anomalies`),

  reportAnomaly: (
    http: HttpFn,
    workbenchId: number,
    payload: CreateAnomalyDto
  ): Promise<AnomalyDto> =>
    http<AnomalyDto>(`/api/workbenches/${workbenchId}/anomalies`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateAnomaly: (
    http: HttpFn,
    anomalyId: number,
    payload: UpdateAnomalyDto
  ): Promise<AnomalyDto> =>
    http<AnomalyDto>(`/api/anomalies/${anomalyId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  /* ===================================================== */
  /* Management / Admin                                   */
  /* ===================================================== */

  getAll: (http: HttpFn): Promise<WorkbenchDto[]> =>
    http<WorkbenchDto[]>('/api/workbenches/all'),

  create: (http: HttpFn, name: string, description?: string): Promise<WorkbenchDto> =>
    http<WorkbenchDto>('/api/workbenches', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    }),

  deactivate: (http: HttpFn, id: number): Promise<WorkbenchDto> =>
    http<WorkbenchDto>(`/api/workbenches/${id}/deactivate`, {
      method: 'POST',
    }),
};