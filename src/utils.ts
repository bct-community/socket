export function formatMsToTime({ ms }: { ms: number }): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  const parts = [];
  if (hours > 0) parts.push(`${hours} hora${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? "s" : ""}`);
  if (seconds > 0) parts.push(`${seconds} segundo${seconds > 1 ? "s" : ""}`);

  return parts.join(" e ") || "0 segundos";
}
