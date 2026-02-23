import type { AuthContextProps } from 'react-oidc-context';
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
  getOverview: (auth: AuthContextProps): Promise<DashboardOverviewDto> =>
    http<DashboardOverviewDto>(auth, '/api/dashboard/overview'),
};