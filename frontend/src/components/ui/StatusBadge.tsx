import type { LeadStatus } from '../../types';

const config: Record<LeadStatus, { bg: string; dot: string; text: string }> = {
  New:       { bg: 'bg-blue-50 dark:bg-blue-500/10',   dot: 'bg-blue-500',   text: 'text-blue-600 dark:text-blue-400' },
  Contacted: { bg: 'bg-amber-50 dark:bg-amber-500/10', dot: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-400' },
  Qualified: { bg: 'bg-green-50 dark:bg-green-500/10', dot: 'bg-green-500',  text: 'text-green-600 dark:text-green-400' },
  Lost:      { bg: 'bg-red-50 dark:bg-red-500/10',     dot: 'bg-red-500',    text: 'text-red-500 dark:text-red-400' },
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const { bg, dot, text } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};
