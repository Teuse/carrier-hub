import type { HttpFn } from '../hooks/useHttp'

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
  getOverview: (http: HttpFn): Promise<DashboardOverviewDto> =>
    http<DashboardOverviewDto>('/api/dashboard/overview'),
};