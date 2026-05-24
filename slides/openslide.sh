#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${ROOT_DIR}/dist"
INDEX_HTML="${ROOT_DIR}/index.html"
PORT="${PORT:-3032}"

log() {
  printf '[slidev] %s\n' "$*"
}

die() {
  printf '[slidev] error: %s\n' "$*" >&2
  exit 1
}

usage() {
  cat <<'EOF'
Usage:
  slides/openslide.sh list
  slides/openslide.sh dev
  slides/openslide.sh build
  slides/openslide.sh publish
  slides/openslide.sh serve
  slides/openslide.sh ship [commit message]

Commands:
  list     Print the available presentation decks under slides/
  dev      Start the open-slide dev server
  build    Build the project into dist/
  publish  Build and copy the root index.html into dist/
  serve    Serve dist/ on http://localhost:3032
  ship     Commit and push the current changes
EOF
}

list_decks() {
  find "${ROOT_DIR}/slides" -mindepth 1 -maxdepth 1 -type d \
    ! -name '.*' \
    ! -name 'node_modules' \
    ! -name 'assets' \
    -print | sed 's#.*/##' | sort
}

ensure_index() {
  [[ -f "${INDEX_HTML}" ]] || die "missing root index.html"
}

run_dev() {
  log "starting dev server"
  cd "${ROOT_DIR}"
  pnpm dev
}

run_build() {
  log "building static bundle"
  cd "${ROOT_DIR}"
  pnpm build
}

run_publish() {
  ensure_index
  run_build

  mkdir -p "${DIST_DIR}"
  cp "${INDEX_HTML}" "${DIST_DIR}/index.html"

  log "copied root index.html to dist/index.html"
  log "publish complete"
}

run_serve() {
  if [[ ! -f "${DIST_DIR}/index.html" ]]; then
    log "dist/index.html not found; running publish first"
    run_publish
  fi

  log "serving dist/ on http://localhost:${PORT}"
  cd "${DIST_DIR}"
  python3 -m http.server "${PORT}"
}

run_ship() {
  local message="${1:-Update slides}"

  ensure_index
  run_publish

  cd "${ROOT_DIR}"
  git add -A

  if git diff --cached --quiet; then
    log "nothing to commit"
    exit 0
  fi

  git commit -m "${message}"
  git push
  log "pushed to origin"
}

main() {
  local cmd="${1:-help}"
  shift || true

  case "${cmd}" in
    list)
      list_decks
      ;;
    dev)
      run_dev
      ;;
    build)
      run_build
      ;;
    publish)
      run_publish
      ;;
    serve)
      run_serve
      ;;
    ship)
      run_ship "${1:-Update slides}"
      ;;
    -h|--help|help)
      usage
      ;;
    *)
      usage >&2
      exit 1
      ;;
  esac
}

main "$@"
