# SlideV 실행 스크립트 (`slides/slidev.sh`) 설명 (한국어)

## 목적
- `slidev` 로 만든 슬라이드 덱을 **개발(dev), 빌드(build), 내보내기(export), publish, serve, ship** 등 다양한 작업을 하나의 쉘 스크립트로 통합 관리
- 사용자가 덱 이름을 직접 지정하지 않아도 자동으로 감지하거나 선택하도록 함

## 주요 기능
| 기능 | 설명 |
|------|------|
| **자동 덱 선택** | `slides/` 폴더 안의 `.md` 파일이 한 개뿐이면 그 덱을 사용<br>여러 개이면 목록을 보여주고 선택을 요구 |
| **로컬 바이너리 우선 사용** | `node_modules/.bin/slidev` 가 존재하면 그것을 사용<br>없으면 `npm exec --yes slidev` 로 fallback |
| **안전 모드** | `set -euo pipefail` 로 오류 시 즉시 중단, 라인 번호 로깅 |
| **작업 로깅** | `[slidev]` 프리픽스로 작업 진행 상황 출력 |
| **Git 연동** | `ship` 커맨드로 변경 사항을 자동 스테이지, 커밋, 푸시 |

## 사용 가능한 명령어

| 명령어 | 사용법 | 설명 |
|--------|--------|------|
| `list` | `slides/slidev.sh list` | 사용 가능한 슬라이드 덱 목록(파일명만) 출력 |
| `dev` | `slides/slidev.sh dev [deck]` | 지정된 덱으로 로컬 개발 서버 시작 (`slidev` dev 모드) |
| `build` | `slides/slidev.sh build [deck] [--out DIR] [--base PATH] [--download]` | 덱을 정적 사이트로 빌드<br> - `--out`: 출력 디렉터리 (기본값: `dist/<deck-name>`)<br> - `--base`: 서브 경로 (예: `/ai-beer/` )<br> - `--download`: 에셋 다운로드 옵션 |
| `export` | `slides/slidev.sh export [deck] [--output FILE] [--format pdf\|pptx\|png\|md] [--with-clicks]` | 덱을 파일로 내보내기<br> - `--output`: 저장 경로<br> - `--format`: 출력 형식 (pdf, pptx, png, md)<br> - `--with-clicks`: 클릭별 페이지 생성 |
| `publish` | `slides/slidev.sh publish` | `slides/` 안의 **모든** 덱을 빌드해서 `dist/` 폴더에 넣고, 프로젝트 루트의 `index.html`을 복사 |
| `serve` | `slides/slidev.sh serve` | `publish` 로 만든 `dist/` 정적 파일을 Python HTTP 서버로 실행 (포트 3032) |
| `ship` | `slides/slidev.sh ship [commit message]` | 변경 사항을 Git에 추가하고 커밋한 뒤 `origin`에 푸시 (메시지 생략 시 “Update slides”) |
| `-h/--help/help` | `slides/slidev.sh -h` | 사용법 및 예시 출력 |

## 사용 예시 (실제 명령어)

```bash
# 1. 사용 가능한 덱 목록 보기
slides/slidev.sh list

# 2. 특정 덱으로 개발 서버 실행
slides/slidev.sh dev 20260507-ai-experience

# 3. 덱을 정적 사이트로 빌드 (출력 경로 지정)
slides/slidev.sh build 20260507-ai-experience --out dist/20260507-ai-experience

# 4. 덱을 PDF 로 내보내기 (클릭별 페이지 포함)
slides/slidev.sh export 20260507-ai-experience \
    --output dist/20260507-ai-experience/slides.pdf \
    --format pdf --with-clicks

# 5. 모든 덱을 publish 하고 로컬에서 서빙
slides/slidev.sh publish
slides/slidev.sh serve   # → http://localhost:3032 에서 확인

# 6. 작업 후 변경 사항을 커밋·푸시
slides/slidev.sh ship "AI Experience 슬라이드 업데이트"
```

## 덱 자동 선택 규칙 (내부 동작)

1. 인자로 덱 이름이 주어지지 않은 경우  
   - `slides/` 에서 `.md` 파일 개수 확인  
   - **파일이 1개** → 그 파일을 덱으로 사용  
   - **파일이 0개 또는 2개 이상** → 목록을 출력하고 오류 종료 (명령어에 따라 선택을 요구)  

2. 인자로 덱 이름이 주어졌을 때  
   - 경로 그대로 존재하면 바로 사용  
   - 존재하지 않으면 `slides/<이름>.md` 를 탐색  
   - 여전히 없으면 부분 일치 파일들을 찾아 복수이면 목록 제시  

## 필수 의존성

| 도구 | 용도 |
|------|------|
| **Bash** | 스크립트 실행 |
| **Node.js / npm** | `slidev` 바이너리 또는 `npm exec slidev` |
| **Python (3 또는 2)** | `serve` 명령어에서 간단한 정적 파일 서버 구동 |
| **Git** | `ship` 명령어에서 커밋·푸시 |

## 슬라이드 발표자료용 요약 (핵심 포인트)

- **통합 인터페이스**: 하나의 스크립트로 개발·빌드·배포 전 과정을 관리  
- **자동화**: 덱 자동 감지, 기본 출력 경로 설정, 클릭별 내보내기 옵션 제공  
- **안전성**: 오류 발생 시 즉시 중단 및 라인 로깅으로 디버깅 용이  
- **확장성**: 새로운 slidev 옵션이 추가돼도 스크립트만 수정하면 즉시 반영 가능  
- **워크플로**: `dev → build/export → publish → serve → ship` 순으로 일반적으로 사용  

이 내용으로 슬라이드를 구성하면, 프로젝트 내 슬라이드 관리를 위한 자동화 스크립트의 구조와 활용 방법을 청중에게 직관적으로 전달할 수 있습니다.