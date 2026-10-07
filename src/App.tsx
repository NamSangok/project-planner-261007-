import { useState, useEffect, useMemo } from 'react';
import type { Project, ProjectStatus, Priority, ViewMode } from './types/project';
import {
  loadProjects,
  saveProjects,
  getInitialTheme,
  saveTheme,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { DashboardSummary } from './components/DashboardSummary';
import { ProjectCard } from './components/ProjectCard';
import { ProjectModal } from './components/ProjectModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { KanbanBoard } from './components/KanbanBoard';
import { TimelineView } from './components/TimelineView';
import { DataManagerModal } from './components/DataManagerModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { FolderPlus } from 'lucide-react';

export function App() {
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ProjectStatus>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | Priority>('all');

  // Modals state
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getInitialTheme());

  useEffect(() => {
    saveTheme(isDarkMode);
  }, [isDarkMode]);

  // Save to LocalStorage whenever projects change
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  // Keep activeProject in sync if it's currently open
  useEffect(() => {
    if (activeProject) {
      const found = projects.find((p) => p.id === activeProject.id);
      if (found) {
        setActiveProject(found);
      }
    }
  }, [projects, activeProject]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(q);
        const matchDesc = project.description.toLowerCase().includes(q);
        const matchTags = project.tags && project.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== '전체' && project.category !== selectedCategory) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && project.status !== selectedStatus) {
        return false;
      }

      // Priority
      if (selectedPriority !== 'all' && project.priority !== selectedPriority) {
        return false;
      }

      return true;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus, selectedPriority]);

  // CRUD Handlers
  const handleSaveProject = (savedProject: Project) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === savedProject.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProject.id ? savedProject : p));
      } else {
        return [savedProject, ...prev];
      }
    });
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('해당 프로젝트를 정말 삭제하시겠습니까?')) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (activeProject?.id === id) {
        setActiveProject(null);
      }
    }
  };

  const handleStatusChange = (id: string, newStatus: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: newStatus,
              manualProgress: newStatus === 'completed' ? 100 : p.manualProgress,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewProject={handleOpenCreate}
        onOpenDataManager={() => setIsDataManagerOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Statistics & Filter summary */}
        <DashboardSummary
          projects={projects}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          selectedPriority={selectedPriority}
          onSelectPriority={setSelectedPriority}
        />

        {/* View Modes */}
        {viewMode === 'dashboard' && (
          <div>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <FolderPlus className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                  조건에 맞는 프로젝트가 없습니다
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  필터를 변경하거나 새로운 프로젝트를 추가하여 업무 진행 계획과 일지를 기록해보세요.
                </p>
                <button
                  onClick={handleOpenCreate}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  새 프로젝트 만들기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={(p) => setActiveProject(p)}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteProject}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {viewMode === 'kanban' && (
          <KanbanBoard
            projects={filteredProjects}
            onSelectProject={(p) => setActiveProject(p)}
            onStatusChange={handleStatusChange}
            onOpenNewProject={handleOpenCreate}
          />
        )}

        {viewMode === 'timeline' && (
          <TimelineView
            projects={filteredProjects}
            onSelectProject={(p) => setActiveProject(p)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Work Project Planner. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="hover:text-blue-500 transition-colors"
            >
              Netlify 배포 안내
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDataManagerOpen(true)}
              className="hover:text-blue-500 transition-colors"
            >
              백업 및 복구
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Project Detail Modal */}
      {activeProject && (
        <ProjectDetailModal
          project={activeProject}
          isOpen={!!activeProject}
          onClose={() => setActiveProject(null)}
          onUpdateProject={handleUpdateProject}
          onEdit={(p) => {
            setActiveProject(null);
            handleOpenEdit(p);
          }}
        />
      )}

      {/* 2. Project Create / Edit Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />

      {/* 3. Data Backup / Restore Modal */}
      <DataManagerModal
        isOpen={isDataManagerOpen}
        onClose={() => setIsDataManagerOpen(false)}
        projects={projects}
        onUpdateProjects={(newProjects) => setProjects(newProjects)}
      />

      {/* 4. GitHub & Netlify Deploy Guide Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
    </div>
  );
}

export default App;
