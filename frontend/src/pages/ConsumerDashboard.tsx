import { useState, useMemo } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Sidebar } from '@/components/shared/Sidebar';
import { StatCard } from '@/components/shared/StatCard';
import { EnergyChart } from '@/components/shared/EnergyChart';
import { TransferList } from '@/components/shared/TransferList';
import { generateTimeSeriesData, generateTransfers } from '@/data/mockData';
import { Zap, Activity, ArrowDownRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ConsumerDashboard() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [requestActive, setRequestActive] = useState(false);
  
  const consumptionData = useMemo(() => generateTimeSeriesData(24), []);
  const incomingTransfers = useMemo(() => generateTransfers(15), []);

  const totalConsumption = useMemo(() => 
    consumptionData.reduce((sum, d) => sum + d.value, 0), [consumptionData]
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
        
        <main className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 shrink-0">
            <StatCard
              title="Total Consumption"
              value={`${totalConsumption} kWh`}
              icon={Zap}
              trend="neutral"
              trendValue="3%"
              subtitle="Last 24 hours"
            />
            <StatCard
              title="Current Usage"
              value="42 kW"
              icon={Activity}
              trend="up"
              trendValue="8%"
              subtitle="Real-time"
            />
            <StatCard
              title="Incoming Energy"
              value="892 kWh"
              icon={ArrowDownRight}
              trend="up"
              trendValue="12%"
              subtitle="This week"
            />
            <StatCard
              title="Pending Requests"
              value="3"
              icon={Clock}
              subtitle="Awaiting approval"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
            {/* Chart Area */}
            <div className="col-span-2 flex flex-col gap-4 min-h-0">
              <div className="flex-1 min-h-0">
                <EnergyChart 
                  data={consumptionData} 
                  title="Energy Consumption (kWh)" 
                  color="hsl(199 89% 48%)"
                  gradientId="consGradient"
                />
              </div>
              
              {/* Incoming Energy List */}
              <div className="h-48">
                <TransferList 
                  transfers={incomingTransfers.slice(0, 6)} 
                  title="Incoming Energy" 
                  showSource
                />
              </div>
            </div>

            {/* Request Panel */}
            <div className="glass-card p-4 flex flex-col">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Energy Request</h3>
              
              <div className="flex-1 flex flex-col gap-4">
                {/* Request Toggle */}
                <div 
                  onClick={() => setRequestActive(!requestActive)}
                  className={cn(
                    "relative rounded-xl p-6 cursor-pointer transition-all duration-300 border-2",
                    requestActive 
                      ? "bg-primary/10 border-primary" 
                      : "bg-muted/30 border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Raise Request</span>
                    <div className={cn(
                      "w-12 h-6 rounded-full transition-all duration-300 relative",
                      requestActive ? "bg-primary" : "bg-muted"
                    )}>
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-foreground transition-all duration-300",
                        requestActive ? "left-7" : "left-1"
                      )} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {requestActive 
                      ? "Monitoring active - tracking consumption" 
                      : "Slide to start monitoring energy needs"}
                  </p>
                  {requestActive && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="pulse-dot" />
                      <span className="text-xs text-primary">Live monitoring</span>
                    </div>
                  )}
                </div>

                {/* Consumption Metrics (shown when active) */}
                {requestActive && (
                  <div className="animate-slide-in space-y-3">
                    <div className="bg-chart-blue/5 rounded-xl p-4 border border-chart-blue/20">
                      <p className="text-sm text-muted-foreground mb-1">Current Demand</p>
                      <p className="text-2xl font-bold font-mono text-foreground">156 kW</p>
                      <div className="w-full bg-muted/30 rounded-full h-2 mt-2">
                        <div className="bg-chart-blue rounded-full h-2 w-3/4" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">75% of capacity</p>
                    </div>

                    <div className="bg-chart-orange/5 rounded-xl p-4 border border-chart-orange/20">
                      <p className="text-sm text-muted-foreground mb-1">Predicted Need</p>
                      <p className="text-2xl font-bold font-mono text-foreground">+48 kWh</p>
                      <p className="text-xs text-muted-foreground mt-1">Next 4 hours</p>
                    </div>
                  </div>
                )}

                {/* Status Info */}
                <div className="mt-auto">
                  <div className="bg-muted/20 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground mb-2">Request Status</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-mono text-chart-orange">3</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Approved</span>
                        <span className="font-mono text-energy-positive">12</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Rejected</span>
                        <span className="font-mono text-energy-negative">2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
