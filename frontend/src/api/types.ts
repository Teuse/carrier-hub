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
  workbenchId: number;
  workbenchName: string;
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