export type UserRole = 'prosumer' | 'consumer' | 'grid';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
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

export interface ConsumerRequest {
  id: string;
  consumerId: string;
  consumerName: string;
  requestedUnits: number;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
  locationId: string;
}

export interface EnergyData {
  time: string;
  value: number;
}
