import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Globe } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitCode = `# 1. GitHub에서 새 Repository(예: project-planner)를 생성합니다.
# 2. 터미널(VS Code / PowerShell)을 열고 아래 명령어를 순서대로 입력하세요:

git remote add origin https://github.com/당신의깃허브아이디/project-planner.git
git branch -M main
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                GitHub 저장 및 Netlify 무료 배포 가이드
              </h3>
              <p className="text-xs text-slate-500">
                인터넷이 되는 전 세계 어디서든 나만의 주소로 접속하는 방법
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: GitHub */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <svg className="w-4 h-4 fill-current text-slate-700 dark:text-slate-300" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                내 GitHub 저장소에 코드 올리기
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 pl-8">
              이미 로컬에 Git 커밋이 완료되어 있습니다. <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">GitHub.com</a>에서 새 저장소(예: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">project-planner</code>)를 생성한 후 아래 명령어를 터미널에서 순서대로 입력하세요.
            </p>

            <div className="relative ml-8">
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto">
                {gitCode}
              </pre>
              <button
                onClick={() => copyToClipboard(gitCode, 1)}
                className="absolute right-3 top-3 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1"
              >
                {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedIndex === 1 ? '복사됨' : '복사'}
              </button>
            </div>
          </div>

          {/* STEP 2: Netlify */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-500" />
                Netlify에서 GitHub 연결하기 (1분 소요)
              </h4>
            </div>

            <div className="ml-8 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                <li>
                  <a
                    href="https://app.netlify.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-semibold underline inline-flex items-center gap-0.5"
                  >
                    Netlify (app.netlify.com) <ExternalLink className="w-3 h-3" />
                  </a>
                  에 접속하여 GitHub 계정으로 로그인합니다.
                </li>
                <li>대시보드에서 <strong>"Add new site"</strong> ➔ <strong>"Import an existing project"</strong>를 클릭합니다.</li>
                <li><strong>"GitHub"</strong>를 선택하고 방금 생성한 <strong>project-planner</strong> 저장소를 지정합니다.</li>
                <li>
                  빌드 설정 확인:
                  <div className="mt-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                    <div>• Build command: <span className="text-blue-600 dark:text-blue-400">npm run build</span></div>
                    <div>• Publish directory: <span className="text-blue-600 dark:text-blue-400">dist</span></div>
                  </div>
                  (프로젝트에 이미 <code className="text-emerald-500">netlify.toml</code> 설정이 포함되어 있어 자동으로 감지됩니다!)
                </li>
                <li>
                  <strong>"Deploy project-planner"</strong> 버튼을 누르면 약 20초 후 나만의 고유 웹 주소(예: <code className="text-blue-500">https://your-planner.netlify.app</code>)가 생성되어 어디서든 실시간으로 접속하실 수 있습니다!
                </li>
              </ol>
            </div>
          </div>

          {/* STEP 3: Continuous Sync Tip */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            <h5 className="font-bold mb-1 flex items-center gap-1.5">
              💡 실시간 모바일 기기 활용 및 데이터 동기화 팁
            </h5>
            <p className="leading-relaxed">
              Netlify에 배포된 사이트는 모바일 스마트폰 화면에서도 완벽히 작동합니다. 스마트폰 브라우저에서 '홈 화면에 추가'를 누르면 네이티브 앱처럼 전체화면으로 편리하게 사용하실 수 있으며, 상단 <strong>데이터 관리</strong> 메뉴에서 JSON 백업/복원을 통해 회사 PC와 개인 노트북 간에 데이터를 즉시 옮길 수 있습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
