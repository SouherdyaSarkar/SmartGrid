export type UserRole = 'prosumer' | 'consumer' | 'grid';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  meter_id?: string;
}

export interface EnergyTransfer {
  id: string;
  units: number;
  timestamp: Date;
  sourceId?: string;
  destinationId?: string;
  locationId?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface EnergyData {
  time: string;
  value: number; // For backward compatibility with charts
  meter_type?: 'prosumer' | 'consumer';
  avg_power_w_p?: number;
  avg_power_w_c?: number;
}
