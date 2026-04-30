export const colors = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
