export type StatKey = 'strength' | 'agility' | 'smart' | 'spirit';
export type StatAbbreviation = 'STR' | 'AGI' | 'INT' | 'SPI';

export const STAT_MAP: Record<StatAbbreviation, StatKey> = {
  STR: 'strength',
  AGI: 'agility',
  INT: 'smart',
  SPI: 'spirit',
};

export const REVERSE_STAT_MAP: Record<StatKey, StatAbbreviation> = {
  strength: 'STR',
  agility: 'AGI',
  smart: 'INT',
  spirit: 'SPI',
};

export const getModifier = (statValue: number): number => {
  return Math.floor((statValue - 10) / 2);
};

export const getRollOutcome = (total: number, raw: number): 'Critical Fail' | 'Failure' | 'Success' | 'Critical Success' => {
  if (raw === 1) return 'Critical Fail';
  if (raw === 20) return 'Critical Success';
  if (total <= 1) return 'Critical Fail';
  if (total <= 10) return 'Failure';
  if (total <= 15) return 'Success';
  return 'Critical Success';
};

export const parseRollRequest = (text: string): StatKey | null => {
  // Look for text matching: **Roll the D20 + STAT to action** (case-insensitive)
  // or just **Roll the D20 + STAT**
  const match = text.match(/\*\*Roll the D20 \+ (STR|AGI|INT|SPI)/i);
  if (match) {
    const abbr = match[1].toUpperCase() as StatAbbreviation;
    return STAT_MAP[abbr] || null;
  }
  return null;
};
