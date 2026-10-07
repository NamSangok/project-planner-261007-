import type { Project, ProjectStatus, Priority } from '../types/project';
import { differenceInCalendarDays, parseISO, isValid } from 'date-fns';

export function calculateProgress(project: Project): number {
  if (project.status === 'completed') {
    return 100;
  }

  if (project.autoCalculateProgress) {
    if (!project.tasks || project.tasks.length === 0) {
      return project.manualProgress ?? 0;
    }
    const completedCount = project.tasks.filter((t) => t.completed).length;
    return Math.round((completedCount / project.tasks.length) * 100);
  }

  return project.manualProgress ?? 0;
}

export function calculateDDay(endDateStr: string): { label: string; isOverdue: boolean; daysLeft: number } {
  if (!endDateStr) {
    return { label: '-', isOverdue: false, daysLeft: 999 };
  }

  try {
    const today = new Date();
    const endDate = parseISO(endDateStr);
    if (!isValid(endDate)) {
      return { label: '-', isOverdue: false, daysLeft: 999 };
    }

    const diff = differenceInCalendarDays(endDate, today);

    if (diff === 0) {
      return { label: 'D-Day', isOverdue: false, daysLeft: 0 };
    } else if (diff > 0) {
      return { label: `D-${diff}`, isOverdue: false, daysLeft: diff };
    } else {
      return { label: `D+${Math.abs(diff)} (지연)`, isOverdue: true, daysLeft: diff };
    }
  } catch {
    return { label: '-', isOverdue: false, daysLeft: 999 };
  }
}

export const STATUS_MAP: Record<ProjectStatus, { label: string; color: string; bg: string; border: string }> = {
  planned: { label: '계획/준비', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/50', border: 'border-amber-200 dark:border-amber-800' },
  'in-progress': { label: '진행 중', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/50', border: 'border-blue-200 dark:border-blue-800' },
  review: { label: '검토/대기', color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-50 dark:bg-purple-950/50', border: 'border-purple-200 dark:border-purple-800' },
  completed: { label: '완료됨', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/50', border: 'border-emerald-200 dark:border-emerald-800' },
  'on-hold': { label: '보류', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-700' },
};

export const PRIORITY_MAP: Record<Priority, { label: string; badge: string }> = {
  urgent: { label: '긴급 🔥', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800' },
  high: { label: '높음', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-800' },
  medium: { label: '보통', badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-300 dark:border-sky-800' },
  low: { label: '낮음', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700' },
};

export const CATEGORIES = ['전체', '인허가', '품질관리', '생산관련', '개발', '정보', '기타'];
