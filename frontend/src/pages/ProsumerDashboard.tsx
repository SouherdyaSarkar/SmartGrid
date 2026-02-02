import { useState, useMemo } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Sidebar } from '@/components/shared/Sidebar';
import { StatCard } from '@/components/shared/StatCard';
import { EnergyChart } from '@/components/shared/EnergyChart';
import { TransferList } from '@/components/shared/TransferList';
import { generateTimeSeriesData, generateTransfers } from '@/data/mockData';
import { Zap, Leaf, DollarSign, TrendingUp } from 'lucide-react';

export default function ProsumerDashboard() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const generationData = useMemo(() => generateTimeSeriesData(24, 'prosumer'), []);
  const transfers = useMemo(() => generateTransfers(15), []);

  const totalGeneration = useMemo(() =>
    generationData.reduce((sum, d) => sum + d.value, 0), [generationData]
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
              title="Total Generation"
              value={`${totalGeneration} kWh`}
              icon={Zap}
              trend="up"
              trendValue="12%"
              subtitle="Last 24 hours"
            />
            <StatCard
              title="Energy Sold"
              value="842 kWh"
              icon={TrendingUp}
              trend="up"
              trendValue="8%"
              subtitle="This week"
            />
            <StatCard
              title="Credits Earned"
              value="$1,247"
              icon={DollarSign}
              trend="up"
              trendValue="15%"
              subtitle="This month"
            />
            <StatCard
              title="Carbon Offset"
              value="2.4 tons"
              icon={Leaf}
              trend="up"
              trendValue="22%"
              subtitle="CO₂ reduced"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
            {/* Chart Area */}
            <div className="col-span-2 flex flex-col gap-4 min-h-0">
              <div className="flex-1 min-h-0">
                <EnergyChart
                  data={generationData}
                  title="Energy Generation (kWh)"
                  color="hsl(142 76% 45%)"
                  gradientId="genGradient"
                />
              </div>

              {/* Transfer History */}
              <div className="h-48">
                <TransferList
                  transfers={transfers.slice(0, 6)}
                  title="Recent Transfers"
                />
              </div>
            </div>

            {/* Credits Panel */}
            <div className="glass-card p-4 flex flex-col">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Credits & Carbon</h3>

              <div className="flex-1 flex flex-col gap-4">
                {/* Credits Earned */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Total Credits</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-foreground">$4,827</p>
                  <p className="text-xs text-muted-foreground mt-1">+$347 this week</p>
                </div>

                {/* Carbon Reduction */}
                <div className="bg-chart-green/5 rounded-xl p-4 border border-chart-green/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-chart-green" />
                    <span className="text-sm text-muted-foreground">Carbon Credits</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-foreground">12.8</p>
                  <p className="text-xs text-muted-foreground mt-1">Metric tons CO₂ offset</p>
                </div>

                {/* Rate Info */}
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-2">Current Rate</p>
                  <p className="text-xl font-bold font-mono text-foreground">$0.14/kWh</p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="pulse-dot" />
                    <span className="text-xs text-primary">Peak pricing active</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-auto grid grid-cols-2 gap-2">
                  <div className="bg-muted/20 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold font-mono">156</p>
                    <p className="text-xs text-muted-foreground">Transfers</p>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold font-mono">98%</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
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
