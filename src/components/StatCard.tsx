
interface StatCardProps {
  label: string;
  value: string;
  dateRange?: string;
}

const StatCard = ({ label, value, dateRange }: StatCardProps) => {
  return (
    <div className="bg-primary p-4 rounded-lg hover:transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
      <div className="text-primary-foreground font-bold text-2xl mb-1">{value}</div>
      <div className="text-primary-foreground text-sm font-medium">{label}</div>
      {dateRange && (
        <div className="text-primary-foreground/80 text-xs mt-1">{dateRange}</div>
      )}
    </div>
  );
};

export default StatCard;
