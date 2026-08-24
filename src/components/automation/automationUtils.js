export const normalizeMsInstances = (payload) => {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.data,
    payload?.content,
    payload?.items,
    payload?.results,
    payload?.payload
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
};

export const getStatusLabel = (status) => {
  const value = String(status || '').toUpperCase();

  if (value === 'COMPLETED') return 'Completed';
  if (value === 'FAILED') return 'Failed';
  if (value === 'IN_PROGRESS') return 'In Progress';

  return value ? value.replace(/_/g, ' ') : 'Unknown';
};

const parseDurationToSeconds = (duration) => {
  if (!duration || typeof duration !== 'string') return null;

  const match = duration.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);

  if ([hours, minutes, seconds].some(Number.isNaN)) return null;

  return (hours * 3600) + (minutes * 60) + seconds;
};

export const formatSecondsAsDuration = (totalSeconds) => {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return 'No completed duration data';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const buildAutomationMetrics = (instances) => {
  const normalized = Array.isArray(instances) ? instances : [];

  const completed = normalized.filter((item) => String(item?.status || '').toUpperCase() === 'COMPLETED');
  const failed = normalized.filter((item) => String(item?.status || '').toUpperCase() === 'FAILED');
  const inProgress = normalized.filter((item) => String(item?.status || '').toUpperCase() === 'IN_PROGRESS');

  const totalExecutions = normalized.length;
  const completedExecutions = completed.length;
  const failedExecutions = failed.length;
  const runningExecutions = inProgress.length;
  const finishedExecutions = completedExecutions + failedExecutions;
  const successRate = finishedExecutions > 0
    ? Math.round((completedExecutions / finishedExecutions) * 100)
    : 0;

  const finishedWithDuration = normalized.filter((item) => {
    const status = String(item?.status || '').toUpperCase();
    return status === 'COMPLETED' || status === 'FAILED';
  }).map((item) => ({
    ...item,
    durationSeconds: parseDurationToSeconds(item?.time_taken)
  })).filter((item) => Number.isFinite(item.durationSeconds));

  const avgDurationSeconds = finishedWithDuration.length > 0
    ? Math.round(finishedWithDuration.reduce((sum, item) => sum + item.durationSeconds, 0) / finishedWithDuration.length)
    : null;

  const fastest = finishedWithDuration.length > 0
    ? finishedWithDuration.reduce((prev, curr) => (curr.durationSeconds < prev.durationSeconds ? curr : prev))
    : null;

  const longest = finishedWithDuration.length > 0
    ? finishedWithDuration.reduce((prev, curr) => (curr.durationSeconds > prev.durationSeconds ? curr : prev))
    : null;

  return {
    totalExecutions,
    completedExecutions,
    failedExecutions,
    runningExecutions,
    finishedExecutions,
    successRate,
    averageDuration: avgDurationSeconds === null ? 'No completed duration data' : formatSecondsAsDuration(avgDurationSeconds),
    avgDurationSeconds,
    fastest,
    longest
  };
};

export const safeDateTime = (value) => {
  if (!value) return 'Running';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '--';
  return parsed.toLocaleString();
};

export const toTrendSeries = (instances) => {
  const countsByDay = {};

  (instances || []).forEach((item) => {
    const value = item?.start_time;
    if (!value) return;

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return;

    const key = d.toISOString().slice(0, 10);
    countsByDay[key] = (countsByDay[key] || 0) + 1;
  });

  const sorted = Object.entries(countsByDay)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, count]) => ({
      date,
      count,
      label: new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
    }));

  return sorted.slice(-7);
};

