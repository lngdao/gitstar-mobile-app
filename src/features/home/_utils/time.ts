import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatTimeAgo(dateString: string): string {
  const date = dayjs(dateString);
  if (!date.isValid()) return '';

  const now = dayjs();
  const diffMinutes = now.diff(date, 'minute');

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m`;

  const diffHours = now.diff(date, 'hour');
  if (diffHours < 24) return `${diffHours}h`;

  const diffDays = now.diff(date, 'day');
  if (diffDays < 7) return `${diffDays}d`;

  if (diffDays < 365) return date.format('MMM D');

  return date.format('MMM D, YYYY');
}
