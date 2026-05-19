interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  bg: string;
  iconColor: string;
}

export const StatCard = ({ label, value, icon: Icon, bg, iconColor }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
      <Icon size={20} className={iconColor} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);
