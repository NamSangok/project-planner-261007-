import React from 'react';
import type { Project } from '../types/project';
import { calculateProgress, calculateDDay, STATUS_MAP } from '../utils/helpers';
import { Calendar, Clock } from 'lucide-react';

interface TimelineViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  projects,
  onSelectProject,
}) => {
  // Sort projects by endDate or startDate
  const sorted = [...projects].sort((a, b) => {
    if (!a.endDate) return 1;
    if (!b.endDate) return -1;
    return a.endDate.localeCompare(b.endDate);
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>프로젝트 일정 및 진척도 타임라인</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            마감일 순으로 정렬된 프로젝트 일정 및 진행 상황입니다.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            표시할 프로젝트가 없습니다.
          </div>
        ) : (
          sorted.map((p) => {
            const progress = calculateProgress(p);
            const dday = calculateDDay(p.endDate);
            const statusInfo = STATUS_MAP[p.status];

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                      {statusInfo.label}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {p.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {p.startDate || '미정'} ~ {p.endDate || '미정'}
                    </span>
                    <span className={`font-semibold px-2 py-0.5 rounded-md ${
                      p.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : dday.isOverdue
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {p.status === 'completed' ? '완료' : dday.label}
                    </span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="relative pt-2">
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-slate-400 text-[11px]">
                      태스크: {p.tasks.filter((t) => t.completed).length}/{p.tasks.length}개 완료
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress === 100
                          ? 'bg-emerald-500'
                          : progress >= 60
                          ? 'bg-blue-600'
                          : progress >= 30
                          ? 'bg-amber-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
