/* ===================================================== */
/* Workspace                                             */
/* ===================================================== */

export interface WorkspaceDto {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

/* ===================================================== */
/* Load Carrier Requests                                 */
/* ===================================================== */

export type RequestPriority =
  | 'LOW'
  | 'NORMAL'
  | 'HIGH'
  | 'URGENT';

export type LoadCarrierRequestStatus =
  | 'REQUESTED'
  | 'WAREHOUSE_IN_PROGRESS'
  | 'READY_FOR_PICKUP'
  | 'IN_DELIVERY'
  | 'DELIVERED';

export interface LoadCarrierRequestDto {
  id: number;
  workspaceId: number;
  workspaceName: string;
  loadCarrierId: number;
  loadCarrierName: string;
  comment?: string;
  priority: RequestPriority;
  status: string;
  createdAt: string;
  deliveredAt?: string;
}

/* ===================================================== */
/* Create DTO                                            */
/* ===================================================== */

export interface CreateLoadCarrierRequestDto {
  loadCarrierId: number;
  comment?: string;
  priority: string;
}

export interface AnomalyDto {
  id: number;
  van?: string;
  pn?: string;
  kz?: string;
  notes?: string;
  workspace: WorkspaceDto;
  status: AnomalyStatus;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  reviewedBy?: string;
}

export type AnomalyStatus =
  | 'REPORTED'
  | 'DECLINED_BY_PQ'
  | 'ACCEPTED_BY_PQ';

export interface CreateAnomalyDto {
  van?: string;
  pn?: string;
  kz?: string;
  notes?: string;
}

export interface UpdateAnomalyDto {
  status?: AnomalyStatus;
  notes?: string;
  van?: string;
  pn?: string;
  kz?: string;
}
