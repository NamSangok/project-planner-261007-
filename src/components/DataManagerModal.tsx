import React, { useRef, useState } from 'react';
import type { Project } from '../types/project';
import { exportToJson, importFromJson } from '../utils/storage';
import { SAMPLE_PROJECTS } from '../utils/sampleData';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface DataManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

export const DataManagerModal: React.FC<DataManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  onUpdateProjects,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportToJson(projects);
    setStatusMessage({ type: 'success', text: '데이터가 JSON 파일로 성공적으로 저장되었습니다.' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromJson(file);
      onUpdateProjects(imported);
      setStatusMessage({ type: 'success', text: `총 ${imported.length}개의 프로젝트 데이터를 성공적으로 불러왔습니다!` });
    } catch (err) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetSample = () => {
    if (confirm('샘플 데이터 세트로 복원하시겠습니까? 현재 작성 중인 데이터는 대체됩니다.')) {
      onUpdateProjects(SAMPLE_PROJECTS);
      setStatusMessage({ type: 'success', text: '기본 샘플 데이터로 초기화되었습니다.' });
    }
  };

  const handleClearAll = () => {
    if (confirm('경고: 모든 프로젝트 데이터가 삭제됩니다. 계속 진행하시겠습니까?')) {
      onUpdateProjects([]);
      setStatusMessage({ type: 'success', text: '모든 데이터가 삭제되었습니다.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                데이터 백업 및 동기화 관리
              </h3>
              <p className="text-xs text-slate-500">다른 PC나 스마트폰으로 데이터 이동 및 백업</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action 1: Export */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-600" />
                데이터 백업 (JSON 다운로드)
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                현재 등록된 모든 프로젝트와 업무 일지를 안전하게 파일로 저장합니다.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
            >
              백업 파일 받기
            </button>
          </div>

          {/* Action 2: Import */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-purple-600" />
                백업 데이터 복원 (JSON 가져오기)
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                다른 기기에서 저장했던 백업 파일을 불러와 바로 이어서 작업합니다.
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-semibold whitespace-nowrap active:scale-95 transition-all"
              >
                파일 선택
              </button>
            </div>
          </div>

          {/* Action 3: Reset Sample */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                샘플 예시 데이터 불러오기
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                작성법을 참고할 수 있는 기본 샘플 프로젝트 3종을 다시 불러옵니다.
              </p>
            </div>
            <button
              onClick={handleResetSample}
              className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold whitespace-nowrap active:scale-95 transition-all"
            >
              샘플 로드
            </button>
          </div>

          {/* Dangerous Zone */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-500 hover:text-rose-700 underline"
            >
              모든 데이터 완전 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
