
import StatCard from "./StatCard";

interface PerformanceBlockProps {
  title: string;
  stats: Array<{
    label: string;
    value: string;
    dateRange?: string;
  }>;
  fbMetrics: {
    costPerLead: string;
    amountSpent: string;
  };
}

const PerformanceBlock = ({ title, stats, fbMetrics }: PerformanceBlockProps) => {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
      <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            dateRange={stat.dateRange}
          />
        ))}
      </div>
      
      {/* Facebook Metrics */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="text-gray-300 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Cost per lead:</span>
            <span className="text-white font-medium">{fbMetrics.costPerLead}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount spent:</span>
            <span className="text-white font-medium">{fbMetrics.amountSpent}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceBlock;
