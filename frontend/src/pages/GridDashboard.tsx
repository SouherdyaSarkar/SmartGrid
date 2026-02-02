import { useState, useMemo } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Sidebar } from '@/components/shared/Sidebar';
import { StatCard } from '@/components/shared/StatCard';
import { generateConsumerRequests, generateTransfers, comparisonData } from '@/data/mockData';
import { Users, Zap, ArrowLeftRight, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { ConsumerRequest } from '@/types/user';

export default function GridDashboard() {
  const [activeItem, setActiveItem] = useState('dashboard');
  
  const consumerRequests = useMemo(() => generateConsumerRequests(10), []);
  const incomingEnergy = useMemo(() => generateTransfers(10), []);

  const pendingRequests = consumerRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
        
        <main className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 shrink-0">
            <StatCard
              title="Active Requests"
              value={pendingRequests}
              icon={Users}
              trend="up"
              trendValue="5"
              subtitle="Pending approval"
            />
            <StatCard
              title="Incoming Energy"
              value="2,847 kWh"
              icon={Zap}
              trend="up"
              trendValue="8%"
              subtitle="Last 24 hours"
            />
            <StatCard
              title="Outgoing Energy"
              value="2,412 kWh"
              icon={ArrowLeftRight}
              trend="neutral"
              trendValue="3%"
              subtitle="Last 24 hours"
            />
            <StatCard
              title="Grid Efficiency"
              value="94.2%"
              icon={Activity}
              trend="up"
              trendValue="1.2%"
              subtitle="Transfer rate"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
            {/* Consumer Requests */}
            <div className="glass-card flex flex-col min-h-0">
              <div className="p-4 border-b border-border/50 flex items-center justify-between shrink-0">
                <h3 className="text-sm font-medium text-muted-foreground">Consumer Requests</h3>
                <span className="text-xs bg-chart-orange/20 text-chart-orange px-2 py-1 rounded-full">
                  {pendingRequests} pending
                </span>
              </div>
              <div className="flex-1 overflow-auto scrollbar-hide">
                {consumerRequests.map((request: ConsumerRequest) => (
                  <div key={request.id} className="data-table-row">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        request.status === 'pending' && "bg-chart-orange",
                        request.status === 'approved' && "bg-energy-positive",
                        request.status === 'rejected' && "bg-energy-negative"
                      )} />
                      <div>
                        <p className="font-medium text-sm">{request.consumerName}</p>
                        <p className="text-xs text-muted-foreground">{request.consumerId} • {request.locationId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-medium">{request.requestedUnits} kWh</p>
                      <p className="text-xs text-muted-foreground">
                        {request.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incoming Energy */}
            <div className="glass-card flex flex-col min-h-0">
              <div className="p-4 border-b border-border/50 flex items-center justify-between shrink-0">
                <h3 className="text-sm font-medium text-muted-foreground">Incoming Energy</h3>
                <span className="text-xs bg-energy-positive/20 text-energy-positive px-2 py-1 rounded-full">
                  {incomingEnergy.filter(t => t.status === 'completed').length} active
                </span>
              </div>
              <div className="flex-1 overflow-auto scrollbar-hide">
                {incomingEnergy.map((transfer) => (
                  <div key={transfer.id} className="data-table-row">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        transfer.status === 'completed' && "bg-energy-positive/10",
                        transfer.status === 'pending' && "bg-energy-neutral/10",
                        transfer.status === 'failed' && "bg-energy-negative/10"
                      )}>
                        <Zap className={cn(
                          "w-4 h-4",
                          transfer.status === 'completed' && "text-energy-positive",
                          transfer.status === 'pending' && "text-energy-neutral",
                          transfer.status === 'failed' && "text-energy-negative"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium font-mono text-sm">{transfer.units} kWh</p>
                        <p className="text-xs text-muted-foreground">{transfer.sourceId} • {transfer.locationId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-xs font-medium capitalize",
                        transfer.status === 'completed' && "text-energy-positive",
                        transfer.status === 'pending' && "text-energy-neutral",
                        transfer.status === 'failed' && "text-energy-negative"
                      )}>
                        {transfer.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transfer.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="h-48 glass-card p-4 shrink-0">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Incoming vs Outgoing Energy</h3>
            <div className="h-[calc(100%-2rem)]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
                  <XAxis dataKey="time" stroke="hsl(215 20% 55%)" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(215 20% 55%)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(222 47% 8%)', 
                      border: '1px solid hsl(217 33% 20%)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="incoming" 
                    stroke="hsl(142 76% 45%)" 
                    strokeWidth={2}
                    dot={false}
                    name="Incoming"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="outgoing" 
                    stroke="hsl(199 89% 48%)" 
                    strokeWidth={2}
                    dot={false}
                    name="Outgoing"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
