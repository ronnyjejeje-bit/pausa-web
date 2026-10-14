// Las fechas viajan como texto "YYYY-MM-DD" para evitar problemas de zona horaria.
export const toIso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const parseIso = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const todayIso = (): string => toIso(new Date());

export const addDaysIso = (iso: string, n: number): string => {
  const d = parseIso(iso);
  d.setDate(d.getDate() + n);
  return toIso(d);
};

export const nightsBetween = (a: string, b: string): number =>
  Math.round((parseIso(b).getTime() - parseIso(a).getTime()) / 86_400_000);

/** Noches ocupadas entre entrada (incluida) y salida (excluida). */
export const eachNight = (checkIn: string, checkOut: string): string[] => {
  const out: string[] = [];
  for (let d = checkIn; d < checkOut; d = addDaysIso(d, 1)) out.push(d);
  return out;
};

export const asIso = (v: string | null): string | null =>
  v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;