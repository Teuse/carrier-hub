import { http } from './http';

export interface DashboardOverviewDto {
  totalRequests: number;
  openRequests: number;
  inWarehouse: number;
  inLogistics: number;
  deliveredToday: number;
  avgLeadTimeMinutes: number;

  requestsByStatus: Record<string, number>;
  requestsByWorkbench: {
    workbenchName: string;
    openRequests: number;
  }[];
}

export const DashboardApi = {
  getOverview: (): Promise<DashboardOverviewDto> =>
    http('/api/dashboard/overview'),
};