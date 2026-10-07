import React from 'react';
import type { Project, ProjectStatus, Priority } from '../types/project';
import { calculateProgress, calculateDDay, CATEGORIES } from '../utils/helpers';
import {
  FolderKanban,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface DashboardSummaryProps {
  projects: Project[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedStatus: 'all' | ProjectStatus;
  onSelectStatus: (status: 'all' | ProjectStatus) => void;
  selectedPriority: 'all' | Priority;
  onSelectPriority: (priority: 'all' | Priority) => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  projects,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  selectedPriority,
  onSelectPriority,
}) => {
  const total = projects.length;
  const inProgress = projects.filter((p) => p.status === 'in-progress').length;
  const completed = projects.filter((p) => p.status === 'completed').length;
  
  // 마감 임박 (진행중/계획중 프로젝트 중 D-3 이내이거나 지연된 건)
  const urgentCount = projects.filter((p) => {
    if (p.status === 'completed' || p.status === 'on-hold') return false;
    const { daysLeft } = calculateDDay(p.endDate);
    return daysLeft <= 3;
  }).length;

  // 전체 평균 진척도
  const avgProgress =
    total > 0
      ? Math.round(
          projects.reduce((acc, curr) => acc + calculateProgress(curr), 0) / total
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* 4 Cards Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              전체 프로젝트
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {total}
              <span className="text-xs font-normal text-slate-400 ml-1">개</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-500" />
              평균 달성률 {avgProgress}%
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              진행 중 프로젝트
            </p>
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {inProgress}
              <span className="text-xs font-normal text-slate-400 ml-1">개</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              집중 진행 단계
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Urgent / Overdue */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              마감 임박 / 지연
            </p>
            <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {urgentCount}
              <span className="text-xs font-normal text-slate-400 ml-1">개</span>
            </h3>
            <p className="text-xs text-rose-500 mt-1">
              D-3 이내 또는 지연
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Completed */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              완료된 프로젝트
            </p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {completed}
              <span className="text-xs font-normal text-slate-400 ml-1">개</span>
            </h3>
            <p className="text-xs text-emerald-500 mt-1">
              완료율 {total > 0 ? Math.round((completed / total) * 100) : 0}%
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value as 'all' | ProjectStatus)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">모든 상태</option>
            <option value="planned">계획/준비</option>
            <option value="in-progress">진행 중</option>
            <option value="review">검토/대기</option>
            <option value="completed">완료됨</option>
            <option value="on-hold">보류</option>
          </select>

          {/* Priority filter */}
          <select
            value={selectedPriority}
            onChange={(e) => onSelectPriority(e.target.value as 'all' | Priority)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">모든 우선순위</option>
            <option value="urgent">긴급 🔥</option>
            <option value="high">높음</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>
        </div>
      </div>
    </div>
  );
};
