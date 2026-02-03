import { EnergyData, EnergyTransfer, ConsumerRequest } from '@/types/user';

export const generateTimeSeriesData = (hours: number = 24, type: 'prosumer' | 'consumer' = 'prosumer'): EnergyData[] => {
  const data: EnergyData[] = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseValue = 50 + Math.sin(i / 4) * 20;
    const noise = Math.random() * 10 - 5;
    const value = Math.round(Math.max(0, baseValue + noise));

    const point: EnergyData = {
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: value,
      meter_type: type,
    };

    if (type === 'prosumer') {
      point.avg_power_w_p = value;
    } else {
      point.avg_power_w_c = value;
    }

    data.push(point);
  }

  return data;
};

export const generateTransfers = (count: number = 10): EnergyTransfer[] => {
  const transfers: EnergyTransfer[] = [];
  const statuses: ('completed' | 'pending' | 'failed')[] = ['completed', 'completed', 'completed', 'pending', 'failed'];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
    transfers.push({
      id: `t-${i}`,
      units: Math.round(Math.random() * 100 + 10),
      timestamp,
      sourceId: `SRC-${String(Math.floor(Math.random() * 900) + 100)}`,
      destinationId: `DST-${String(Math.floor(Math.random() * 900) + 100)}`,
      locationId: `LOC-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9) + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return transfers.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const generateConsumerRequests = (count: number = 8): ConsumerRequest[] => {
  const requests: ConsumerRequest[] = [];
  const names = ['Factory Alpha', 'Complex Beta', 'Facility Gamma', 'Plant Delta', 'Hub Epsilon'];
  const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'pending', 'approved', 'rejected'];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000);
    requests.push({
      id: `req-${i}`,
      consumerId: `C-${String(Math.floor(Math.random() * 900) + 100)}`,
      consumerName: names[Math.floor(Math.random() * names.length)],
      requestedUnits: Math.round(Math.random() * 200 + 50),
      timestamp,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      locationId: `LOC-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9) + 1}`,
    });
  }

  return requests.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const comparisonData = [
  { time: '00:00', incoming: 45, outgoing: 38 },
  { time: '04:00', incoming: 32, outgoing: 28 },
  { time: '08:00', incoming: 78, outgoing: 65 },
  { time: '12:00', incoming: 95, outgoing: 82 },
  { time: '16:00', incoming: 88, outgoing: 75 },
  { time: '20:00', incoming: 62, outgoing: 55 },
  { time: '24:00', incoming: 48, outgoing: 42 },
];
