export interface HealthDTO {
  id: string;
  status: 'healthy';
  formattedCreatedAt: string;
  formattedLastCheckedAt: string;
  formattedUptime: string;
}
