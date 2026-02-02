import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { EnergyData } from '@/types/user';

interface EnergyChartProps {
  data: EnergyData[];
  title: string;
  color?: string;
  gradientId?: string;
}

export function EnergyChart({ data, title, color = 'hsl(142 76% 45%)', gradientId = 'energyGradient' }: EnergyChartProps) {
  return (
    <div className="chart-container flex flex-col h-full">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(215 20% 55%)" 
              fontSize={11}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(215 20% 55%)" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222 47% 8%)', 
                border: '1px solid hsl(217 33% 20%)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
