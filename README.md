# 📋 개인 업무 프로젝트 플래너 (Work Project Planner)

> 언제 어디서나 업무 프로젝트별 **진행 계획, 세부 태스크, 진행 일지(히스토리), 실시간 진척도**를 직관적으로 파악하고 관리할 수 있는 반응형 웹 애플리케이션입니다.

![Preview](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80)

---

## ✨ 핵심 기능

1. **📊 실시간 진척도 대시보드 (Dashboard Overview)**
   - 전체 프로젝트 수, 진행 중, 마감 임박(D-Day/지연), 완료율 통계 카드
   - 하위 세부 태스크 완료 시 0~100% 진척도 자동 계산 및 실시간 반영 (수동 조절 모드 지원)
   - 카테고리별(개발, 기획, 디자인, 마케팅, 개인 등) 및 우선순위/상태 필터링

2. **📋 세부 계획 및 태스크 체크리스트 (Task Management)**
   - 각 프로젝트별 해야 할 세부 태스크 목록 추가 및 마감일 관리
   - 체크박스 클릭 한 번으로 완료 상태 토글 및 프로젝트 전체 진척도 즉시 갱신

3. **📝 일자별 업무 진행 일지 / 히스토리 (Work Log)**
   - 일일 진행 내용, 이슈 및 트러블슈팅, 회의 메모, 의사 결정 사항 기록
   - 날짜별 타임라인 피드 형태로 한눈에 프로젝트 히스토리 추적

4. **🗂️ 3가지 맞춤형 시각화 뷰 모드**
   - **대시보드 뷰 (Grid)**: 카드 형태로 한눈에 전체 프로젝트 진척도 조망
   - **칸반 보드 뷰 (Kanban)**: 계획/준비 ➔ 진행 중 ➔ 검토/대기 ➔ 완료 단계별 이동
   - **타임라인 뷰 (Timeline)**: 마감일 순 일정 바 차트 및 기간 시각화

5. **🌙 다크 모드 & 모바일 반응형 디자인**
   - PC, 태블릿, 모바일 스마트폰 전 기기 완벽 지원
   - 세련된 다크 모드 / 라이트 모드 전환 지원

6. **💾 데이터 백업 및 복원 (JSON Import/Export)**
   - 브라우저 자동 저장(LocalStorage)으로 별도 회원가입 없이 즉시 사용
   - 원클릭 JSON 백업 다운로드 및 복원으로 회사 PC, 집 노트북 등 기기간 데이터 이동 간편

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Hosting / Deploy**: Netlify (`netlify.toml` 내장)

---

## 🚀 로컬 실행 방법

```bash
# 1. 패키지 설치
npm install

# 2. 로컬 개발 서버 시작
npm run dev

# 3. 프로덕션 빌드
npm run build
```

---

## 🌐 Netlify 무료 배포 방법

상세한 배포 절차는 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)를 참고하세요.

1. GitHub에 새 저장소(`project-planner`) 생성
2. 코드 푸시:
   ```bash
   git remote add origin https://github.com/NamSangok/project-planner.git
   git branch -M main
   git push -u origin main
   ```
3. [Netlify](https://app.netlify.com)에 로그인 후 GitHub 저장소 연결
4. 배포 완료 후 전 세계 어디서든 접속 가능한 고유 URL 발급!
