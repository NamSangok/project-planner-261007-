# 🚀 GitHub 연동 및 Netlify 배포 가이드

본 프로젝트는 **React + TypeScript + Tailwind CSS** 기반의 웹 애플리케이션으로, 어디서나 접속할 수 있는 **Netlify 무료 호스팅**에 완벽하게 최적화되어 있습니다.

---

## 1단계: GitHub에 새 저장소 만들기 (1분 소요)

1. 웹 브라우저에서 [GitHub 로그인 및 새 저장소 생성(github.com/new)](https://github.com/new) 페이지로 이동합니다.
2. **Repository name**에 `project-planner` (또는 원하는 이름)를 입력합니다.
3. 공개 여부(Public 또는 Private)를 선택합니다. (Netlify는 비공개(Private) 저장소도 무료로 배포 가능합니다!)
4. **"Initialize this repository with..."** 항목들은 모두 체크 해제(빈 상태)로 둔 뒤, 맨 아래 **"Create repository"** 버튼을 클릭합니다.

---

## 2단계: 터미널에서 코드 GitHub로 올리기 (3줄 복사/붙여넣기)

터미널(PowerShell 또는 VS Code 터미널)에서 아래 명령어를 순서대로 실행합니다:

```bash
# 본 프로젝트 폴더로 이동 (이미 해당 폴더인 경우 생략)
cd C:\Users\JMT1\.gemini\antigravity\scratch\project-planner

# 원격 저장소 연결 (아래 URL의 'NamSangok'을 본인 GitHub 아이디로 확인하세요)
git remote add origin https://github.com/NamSangok/project-planner.git

# 기본 브랜치를 main으로 지정
git branch -M main

# GitHub로 업로드
git push -u origin main
```

---

## 3단계: Netlify에서 원클릭 배포하기 (2분 소요)

1. [Netlify 공식 사이트 (https://app.netlify.com)](https://app.netlify.com)에 접속하여 **"Log in with GitHub"**로 로그인합니다.
2. 대시보드 우측 상단의 **"Add new site"** 버튼을 누르고 **"Import an existing project"**를 선택합니다.
3. 배포 제공자로 **"GitHub"**를 클릭하고, 저장소 목록에서 방금 푸시한 **`project-planner`**를 선택합니다.
4. **Build & deploy settings** 화면이 나타납니다:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build` *(자동 입력됨)*
   - **Publish directory**: `dist` *(자동 입력됨)*
   *(프로젝트에 이미 `netlify.toml` 설정 파일이 들어있어 별도 수정 없이 기본값 그대로 사용하시면 됩니다!)*
5. 맨 아래 **"Deploy project-planner"** (또는 Deploy site) 버튼을 클릭합니다.
6. 약 20~30초 후 배포가 완료되면 상단에 고유 웹 주소(예: `https://something-random-12345.netlify.app`)가 생성됩니다.

---

## 4단계: 나만의 예쁜 주소(도메인 이름)로 변경하기 (선택)

1. Netlify 사이트 대시보드에서 **"Site configuration"** ➔ **"Change site name"**을 클릭합니다.
2. 원하는 이름(예: `my-work-planner`)을 입력하고 저장하면 즉시:
   👉 **`https://my-work-planner.netlify.app`** 주소로 어디서나 접속할 수 있습니다!

---

## 💡 모바일 스마트폰에서 앱처럼 사용하는 팁

1. 스마트폰(아이폰 Safari 또는 안드로이드 Chrome)으로 위 Netlify 배포 주소에 접속합니다.
2. 브라우저 메뉴에서 **"홈 화면에 추가"** (Add to Home screen)를 누릅니다.
3. 스마트폰 홈 화면에 전용 아이콘이 생기며, 탭하면 앱처럼 전체화면으로 쾌적하게 사용할 수 있습니다!

---

## 💾 기기간 데이터 동기화 팁

- 회사 PC에서 작업 후 상단 **데이터 관리 (데이터베이스 아이콘)** ➔ **"백업 파일 받기 (JSON)"** 클릭
- 집 PC나 노트북에서 접속 후 **"백업 데이터 복원"**으로 해당 JSON 파일을 선택하면 1초 만에 최신 데이터가 반영됩니다!
