import { EnergyTransfer } from '@/types/user';
import { cn } from '@/lib/utils';
import { Zap, Clock, MapPin } from 'lucide-react';

interface TransferListProps {
  transfers: EnergyTransfer[];
  title: string;
  showSource?: boolean;
}

export function TransferList({ transfers, title, showSource = false }: TransferListProps) {
  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <div className="flex-1 overflow-auto scrollbar-hide">
        {transfers.map((transfer) => (
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
                {showSource && transfer.sourceId && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {transfer.sourceId} • {transfer.locationId}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {transfer.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-muted-foreground">
                {transfer.timestamp.toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
