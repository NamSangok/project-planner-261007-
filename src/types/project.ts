export type ProjectStatus = 'planned' | 'in-progress' | 'review' | 'completed' | 'on-hold';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  assignee?: string;
}

export interface WorkLog {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  category: 'progress' | 'issue' | 'meeting' | 'decision' | 'note';
  author?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., '개발', '기획', '마케팅', '운영', '디자인', '기타'
  priority: Priority;
  status: ProjectStatus;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  manualProgress?: number; // 0-100 (옵션: 수동 지정 시)
  autoCalculateProgress: boolean; // 태스크 완료율에 따라 자동 계산할지 여부
  tasks: SubTask[];
  logs: WorkLog[];
  tags: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'dashboard' | 'kanban' | 'timeline';

export interface ProjectFilter {
  search: string;
  status: 'all' | ProjectStatus;
  priority: 'all' | Priority;
  category: 'all' | string;
}
