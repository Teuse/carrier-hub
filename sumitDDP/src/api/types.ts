/* ===================================================== */
/* Workbench                                             */
/* ===================================================== */

export interface WorkbenchDto {
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
  name: string;
  description?: string;
  comment?: string;
  priority: RequestPriority;
  status: LoadCarrierRequestStatus;
  createdAt: string;
  workbench: WorkbenchDto;
}

/* ===================================================== */
/* Create DTO                                            */
/* ===================================================== */

export interface CreateLoadCarrierRequestDto {
  name: string;
  description?: string;
  comment?: string;
  priority: RequestPriority;
}