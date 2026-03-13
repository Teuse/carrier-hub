import { http } from './http';

export interface DashboardOverviewDto {
  totalRequests: number;
  openRequests: number;
  inWarehouse: number;
  inLogistics: number;
  deliveredToday: number;
  avgLeadTimeMinutes: number;

  requestsByStatus: Record<string, number>;
  requestsByWorkspace: {
    workspaceName: string;
    openRequests: number;
  }[];
}

export interface DashboardChartDto {
  anomaliesByStatusInWeek: Record<string, number>;
  anomaliesPerWorkspace: {
    workspaceName: string;
    anomalyPercentage: number;
  }[]
}

export const DashboardApi = {
  getOverview: (): Promise<DashboardOverviewDto> =>
    http('/api/dashboard/overview'),
  getChartData: (): Promise<DashboardChartDto> =>
    http('/api/dashboard/charts')
};
