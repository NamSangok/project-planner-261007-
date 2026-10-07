import React, { useState } from 'react';
import type { Project, ProjectStatus, SubTask, WorkLog } from '../types/project';
import {
  calculateProgress,
  calculateDDay,
  STATUS_MAP,
  PRIORITY_MAP,
} from '../utils/helpers';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  ListTodo,
  Check,
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProject: (updated: Project) => void;
  onEdit: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onUpdateProject,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'logs'>('tasks');

  // Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Log form state
  const [newLogContent, setNewLogContent] = useState('');
  const [newLogCategory, setNewLogCategory] = useState<WorkLog['category']>('progress');
  const [newLogDate, setNewLogDate] = useState(() => new Date().toISOString().slice(0, 10));

  if (!isOpen) return null;

  const progress = calculateProgress(project);
  const dday = calculateDDay(project.endDate);
  const statusInfo = STATUS_MAP[project.status];
  const priorityInfo = PRIORITY_MAP[project.priority];

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = project.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    const updated = {
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: SubTask = {
      id: 'task-' + Date.now(),
      title: newTaskTitle.trim(),
      completed: false,
      dueDate: newTaskDueDate || undefined,
    };

    const updated = {
      ...project,
      tasks: [...project.tasks, newTask],
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
    setNewTaskTitle('');
    setNewTaskDueDate('');
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = project.tasks.filter((t) => t.id !== taskId);
    const updated = {
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
  };

  // Work Log Handlers
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogContent.trim()) return;

    const newLog: WorkLog = {
      id: 'log-' + Date.now(),
      date: newLogDate || new Date().toISOString().slice(0, 10),
      category: newLogCategory,
      content: newLogContent.trim(),
      author: '나',
    };

    const updated = {
      ...project,
      logs: [newLog, ...project.logs], // 최신순
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
    setNewLogContent('');
  };

  const handleDeleteLog = (logId: string) => {
    const updatedLogs = project.logs.filter((l) => l.id !== logId);
    const updated = {
      ...project,
      logs: updatedLogs,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
  };

  // Progress Mode Toggle & Slider
  const handleToggleAutoProgress = () => {
    const updated = {
      ...project,
      autoCalculateProgress: !project.autoCalculateProgress,
      manualProgress: progress,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
  };

  const handleManualProgressChange = (newVal: number) => {
    const updated = {
      ...project,
      manualProgress: newVal,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
  };

  const handleStatusChange = (newStatus: ProjectStatus) => {
    const updated = {
      ...project,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
  };

  const getCategoryBadge = (cat: WorkLog['category']) => {
    switch (cat) {
      case 'progress':
        return { label: '진행', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' };
      case 'issue':
        return { label: '이슈/장애', bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' };
      case 'meeting':
        return { label: '회의', bg: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' };
      case 'decision':
        return { label: '결정사항', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' };
      default:
        return { label: '메모', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold">
                {project.category}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${priorityInfo.badge}`}>
                {priorityInfo.label}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                project.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : dday.isOverdue
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                <Clock className="w-3 h-3" />
                {project.status === 'completed' ? '완료' : dday.label}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {project.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {project.description || '상세 설명이 없습니다.'}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {project.startDate || '시작일 미정'} ~ {project.endDate || '종료일 미정'}
              </span>
            </div>
          </div>

          {/* Action buttons & Close */}
          <div className="flex items-center gap-2">
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold focus:outline-none ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
            >
              <option value="planned">계획/준비</option>
              <option value="in-progress">진행 중</option>
              <option value="review">검토/대기</option>
              <option value="completed">완료됨</option>
              <option value="on-hold">보류</option>
            </select>

            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="프로젝트 수정"
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Real-time Setting */}
        <div className="px-6 py-4 bg-blue-50/40 dark:bg-blue-950/20 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                실시간 진척도
              </span>
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                {progress}%
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={project.autoCalculateProgress}
                  onChange={handleToggleAutoProgress}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                태스크 완료에 따라 자동 계산
              </label>

              {!project.autoCalculateProgress && (
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={project.manualProgress ?? 0}
                    onChange={(e) => handleManualProgressChange(Number(e.target.value))}
                    className="w-24 sm:w-36 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="w-8 text-right font-semibold text-slate-700 dark:text-slate-300">
                    {project.manualProgress ?? 0}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200/80 dark:bg-slate-700/80 overflow-hidden">
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'tasks'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>세부 계획 및 태스크 ({project.tasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>업무 진행 일지 ({project.logs.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Tasks */}
          {activeTab === 'tasks' && (
            <div className="space-y-5">
              {/* Add task form */}
              <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="새 계획 / 태스크 입력 (예: API 명세서 작성)"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
                  title="태스크 마감일"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>추가</span>
                </button>
              </form>

              {/* Task list */}
              {project.tasks.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <ListTodo className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    아직 등록된 세부 계획이나 태스크가 없습니다.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    위 입력창을 통해 해야 할 일을 추가하고 진척도를 실시간으로 관리해보세요!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        task.completed
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/60 opacity-75'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleTask(task.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            task.completed
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5" />}
                        </button>
                        <span
                          className={`text-sm truncate select-none ${
                            task.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {task.dueDate && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.dueDate}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Work Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              {/* Add log form */}
              <form
                onSubmit={handleAddLog}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="date"
                    value={newLogDate}
                    onChange={(e) => setNewLogDate(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                  <select
                    value={newLogCategory}
                    onChange={(e) => setNewLogCategory(e.target.value as WorkLog['category'])}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="progress">진행 내용</option>
                    <option value="issue">이슈 / 문제 해결</option>
                    <option value="meeting">회의 기록</option>
                    <option value="decision">의사 결정</option>
                    <option value="note">단순 메모</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  placeholder="오늘 진행된 내용, 특이사항, 결정된 내용을 기록해보세요..."
                  value={newLogContent}
                  onChange={(e) => setNewLogContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>일지 등록</span>
                  </button>
                </div>
              </form>

              {/* Logs Timeline */}
              {project.logs.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    작성된 진행 일지가 없습니다.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    프로젝트의 중요한 변경점이나 일일 작업 내용을 꾸준히 남겨보세요.
                  </p>
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {project.logs.map((log) => {
                    const badge = getCategoryBadge(log.category);
                    return (
                      <div key={log.id} className="relative group">
                        {/* Dot */}
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900" />

                        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                {log.date}
                              </span>
                              <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${badge.bg}`}>
                                {badge.label}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {log.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
