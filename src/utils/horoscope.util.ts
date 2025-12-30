export function calculateHoroscope(date: Date): string {
  return calculateZodiac(date).split(' ')[0];
}

import { calculateZodiac } from './zodiac.util';