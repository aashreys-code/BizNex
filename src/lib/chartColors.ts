/**
 * Theme-aware chart colors for recharts SVG elements.
 * CSS variables don't resolve in SVG fill/stroke attributes,
 * so we provide explicit hex values for each mode.
 */
export function chartColors(isDark: boolean) {
  return {
    // Primary accent (BizNex tiffany green)
    accent: isDark ? '#21F1A8' : '#004741',
    // Info / blue
    info: isDark ? '#3b82f6' : '#1e40af',
    // Success / green
    success: isDark ? '#22c55e' : '#166534',
    // Warning / amber
    warning: isDark ? '#eab308' : '#92400e',
    // Danger / red
    danger: isDark ? '#ef4444' : '#991b1b',
    // Purple
    purple: isDark ? '#8b5cf6' : '#6d28d9',
    // Grid lines
    grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    // Axis text
    axis: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)',
    // Tooltip background
    tooltipBg: isDark ? '#242424' : '#ffffff',
    tooltipBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
    tooltipColor: isDark ? '#f0f0f0' : '#1a1a1a',
    // Label text in charts
    label: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  } as const
}

/** Returns a recharts-compatible contentStyle object for tooltips */
export function tooltipContentStyle(isDark: boolean) {
  const c = chartColors(isDark)
  return {
    background: c.tooltipBg,
    border: `1px solid ${c.tooltipBorder}`,
    borderRadius: '8px',
    fontSize: '12px',
    color: c.tooltipColor,
  }
}
