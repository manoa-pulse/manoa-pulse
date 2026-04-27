export const getHeatColor = (level: number) => {
  if (level <= 3) return 'rgba(0, 200, 0, 0.3)';      // green
  if (level <= 6) return 'rgba(255, 200, 0, 0.35)';   // yellow
  if (level <= 8) return 'rgba(255, 120, 0, 0.4)';    // orange
  return 'rgba(255, 0, 0, 0.45)';                     // red
};