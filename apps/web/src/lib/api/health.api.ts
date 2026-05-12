import { apiRequest } from './client';

export type HealthResponse = {
  status: string;
  timestamp: string;
  database: string;
  dbError?: string;
};

export function getHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/health');
}
