'use client';

import { useEffect, useState } from 'react';

// Horarios de atención. Domingo = 0.
export const schedule = {
  weekday: { days: [1, 2, 3, 4, 5], open: [7, 30], close: [20, 0], label: '7:30' },
  weekend: { days: [6, 0], open: [8, 30], close: [21, 0], label: '8:30' },
} as const;

export type OpenStatus = { isOpen: boolean; text: string; dayIndex: number };

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Estado de apertura en hora de Buenos Aires, sin depender de la zona horaria del visitante. */
export function getOpenStatus(now = new Date()): OpenStatus {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;

  const dayIndex = WEEKDAYS.indexOf(get('weekday'));
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  const isWeekend = dayIndex === 0 || dayIndex === 6;
  const today = isWeekend ? schedule.weekend : schedule.weekday;
  const openAt = today.open[0] * 60 + today.open[1];
  const closeAt = today.close[0] * 60 + today.close[1];
  const isOpen = minutes >= openAt && minutes < closeAt;

  if (isOpen) return { isOpen, dayIndex, text: `Abierto ahora, hasta las ${today.close[0]}:00` };

  const afterClose = minutes >= closeAt;
  const nextIsWeekend = afterClose ? dayIndex === 5 || dayIndex === 6 : isWeekend;
  const next = nextIsWeekend ? schedule.weekend : schedule.weekday;
  return { isOpen, dayIndex, text: `Cerrado ahora, abrimos ${afterClose ? 'mañana' : 'hoy'} a las ${next.label}` };
}

/** Hook: null en el servidor y en el primer render, para no desajustar la hidratación. */
export function useOpenStatus(): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    setStatus(getOpenStatus());
    const id = window.setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}
