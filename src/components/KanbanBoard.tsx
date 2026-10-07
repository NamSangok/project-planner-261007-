import React from 'react';
import type { Project, ProjectStatus } from '../types/project';
import { calculateProgress, calculateDDay, STATUS_MAP, PRIORITY_MAP } from '../utils/helpers';
import {
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Plus,
} from 'lucide-react';

interface KanbanBoardProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onStatusChange: (id: string, newStatus: ProjectStatus) => void;
  onOpenNewProject: () => void;
}

const COLUMNS: { id: ProjectStatus; title: string; color: string }[] = [
  { id: 'planned', title: '계획/준비', color: 'border-t-amber-500' },
  { id: 'in-progress', title: '진행 중', color: 'border-t-blue-500' },
  { id: 'review', title: '검토/대기', color: 'border-t-purple-500' },
  { id: 'completed', title: '완료됨', color: 'border-t-emerald-500' },
];

const STATUS_ORDER: ProjectStatus[] = ['planned', 'in-progress', 'review', 'completed'];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projects,
  onSelectProject,
  onStatusChange,
  onOpenNewProject,
}) => {
  const getNextStatus = (current: ProjectStatus): ProjectStatus | null => {
    const idx = STATUS_ORDER.indexOf(current);
    if (idx !== -1 && idx < STATUS_ORDER.length - 1) {
      return STATUS_ORDER[idx + 1];
    }
    return null;
  };

  const getPrevStatus = (current: ProjectStatus): ProjectStatus | null => {
    const idx = STATUS_ORDER.indexOf(current);
    if (idx > 0) {
      return STATUS_ORDER[idx - 1];
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
      {COLUMNS.map((col) => {
        const colProjects = projects.filter((p) => p.status === col.id);

        return (
          <div
            key={col.id}
            className={`bg-slate-100/70 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 border-t-4 ${col.color} min-h-[500px] flex flex-col`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {col.title}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold shadow-xs">
                  {colProjects.length}
                </span>
              </div>

              {col.id === 'planned' && (
                <button
                  onClick={onOpenNewProject}
                  className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  title="새 프로젝트 추가"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1">
              {colProjects.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl">
                  <p className="text-xs text-slate-400">해당 상태의 프로젝트가 없습니다.</p>
                </div>
              ) : (
                colProjects.map((p) => {
                  const progress = calculateProgress(p);
                  const dday = calculateDDay(p.endDate);
                  const priorityInfo = PRIORITY_MAP[p.priority];
                  const nextStatus = getNextStatus(p.status);
                  const prevStatus = getPrevStatus(p.status);
                  const completedTasks = p.tasks.filter((t) => t.completed).length;

                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectProject(p)}
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
                    >
                      {/* Top badging */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {p.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${priorityInfo.badge}`}>
                            {priorityInfo.label}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            p.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                              : dday.isOverdue
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {p.status === 'completed' ? '완료' : dday.label}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {p.title}
                      </h4>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-400">진척도</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Bottom Footer: Task count & Stage Move Buttons */}
                      <div
                        className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <CheckSquare className="w-3 h-3 text-slate-400" />
                          <span>{completedTasks}/{p.tasks.length}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {prevStatus && (
                            <button
                              onClick={() => onStatusChange(p.id, prevStatus)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                              title={`${STATUS_MAP[prevStatus].label} 단계로 이동`}
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {nextStatus && (
                            <button
                              onClick={() => onStatusChange(p.id, nextStatus)}
                              className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                              title={`${STATUS_MAP[nextStatus].label} 단계로 이동`}
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
