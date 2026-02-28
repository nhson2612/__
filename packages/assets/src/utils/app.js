export const relativeTime = (value, now = new Date()) => {
  const target = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(target.getTime())) return '';

  const diffMs = target.getTime() - now.getTime();
  const absMs = Math.abs(diffMs);
  const units = [
    {unit: 'year', ms: 1000 * 60 * 60 * 24 * 365},
    {unit: 'month', ms: 1000 * 60 * 60 * 24 * 30},
    {unit: 'week', ms: 1000 * 60 * 60 * 24 * 7},
    {unit: 'day', ms: 1000 * 60 * 60 * 24},
    {unit: 'hour', ms: 1000 * 60 * 60},
    {unit: 'minute', ms: 1000 * 60},
    {unit: 'second', ms: 1000}
  ];

  const {unit, ms} = units.find(item => absMs >= item.ms) || units[units.length - 1];
  const valueInUnit = Math.round(diffMs / ms);

  if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
    const formatter = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto'});
    return formatter.format(valueInUnit, unit);
  }

  const absValue = Math.abs(valueInUnit);
  const suffix = valueInUnit < 0 ? 'ago' : 'from now';
  const plural = absValue === 1 ? '' : 's';
  return `${absValue} ${unit}${plural} ${suffix}`;
};
