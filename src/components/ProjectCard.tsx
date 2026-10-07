import React from 'react';
import type { Project, ProjectStatus } from '../types/project';
import {
  calculateProgress,
  calculateDDay,
  STATUS_MAP,
  PRIORITY_MAP,
} from '../utils/helpers';
import {
  Calendar,
  CheckSquare,
  Clock,
  MoreVertical,
  MessageSquareText,
  Trash2,
  Edit,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: ProjectStatus) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const progress = calculateProgress(project);
  const dday = calculateDDay(project.endDate);
  const statusInfo = STATUS_MAP[project.status];
  const priorityInfo = PRIORITY_MAP[project.priority];

  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;
  const latestLog = project.logs.length > 0 ? project.logs[project.logs.length - 1] : null;

  return (
    <div
      onClick={() => onSelect(project)}
      className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges: Category, Priority, D-Day & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
              {project.category}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityInfo.badge}`}
            >
              {priorityInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* D-Day badge */}
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                project.status === 'completed'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  : dday.isOverdue
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                  : dday.daysLeft <= 3
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Clock className="w-3 h-3" />
              {project.status === 'completed' ? '완료' : dday.label}
            </span>

            {/* Meatball menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="더보기"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(project);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    수정하기
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(project.id);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 min-h-[32px]">
          {project.description || '상세 설명이 없습니다.'}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[10px] text-slate-400">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              진척도
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {progress}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
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

        {/* Tasks count & Latest Work Log preview */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
            <span>태스크 {completedTasks}/{totalTasks}</span>
          </div>
          {latestLog ? (
            <div
              className="flex items-center gap-1 truncate max-w-[150px] text-[11px]"
              title={`최신 일지 (${latestLog.date}): ${latestLog.content}`}
            >
              <MessageSquareText className="w-3 h-3 flex-shrink-0 text-slate-400" />
              <span className="truncate">{latestLog.content}</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400">일지 없음</span>
          )}
        </div>

        {/* Bottom Status selector & Date */}
        <div
          className="flex items-center justify-between pt-1 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Calendar className="w-3 h-3" />
            <span>{project.startDate || '미정'} ~ {project.endDate || '미정'}</span>
          </div>

          {/* Quick status dropdown */}
          <select
            value={project.status}
            onChange={(e) => onStatusChange(project.id, e.target.value as ProjectStatus)}
            className={`text-xs px-2 py-0.5 rounded-lg border font-medium focus:outline-none transition-colors ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
          >
            <option value="planned">계획/준비</option>
            <option value="in-progress">진행 중</option>
            <option value="review">검토/대기</option>
            <option value="completed">완료됨</option>
            <option value="on-hold">보류</option>
          </select>
        </div>
      </div>
    </div>
  );
};
