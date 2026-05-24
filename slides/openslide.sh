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

write_deck_wrapper() {
  local slug="$1"
  local out_dir="${DIST_DIR}/${slug}"
  mkdir -p "${out_dir}"

  cat > "${out_dir}/index.html" <<EOF
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${slug}</title>
    <script>
      const target = location.protocol === 'file:'
        ? 'http://localhost:${PORT}/s/${slug}'
        : '/s/${slug}';
      location.replace(target);
    </script>
  </head>
  <body>
    <p>Opening ${slug}...</p>
  </body>
</html>
EOF
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
  rm -rf "${DIST_DIR}"
  run_build

  mkdir -p "${DIST_DIR}"
  cp "${INDEX_HTML}" "${DIST_DIR}/index.html"
  while IFS= read -r slug; do
    [[ -n "${slug}" ]] || continue
    write_deck_wrapper "${slug}"
  done < <(list_decks)

  log "copied root index.html to dist/index.html"
  log "generated slide wrappers in dist/<slide>/index.html"
  log "publish complete"
}

run_serve() {
  if [[ ! -f "${DIST_DIR}/index.html" ]]; then
    log "dist/index.html not found; running publish first"
    run_publish
  fi

  log "serving dist/ on http://localhost:${PORT}"
  cd "${DIST_DIR}"
  python3 - "${PORT}" <<'PY'
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote

port = int(sys.argv[1])
root = os.getcwd()
index_path = os.path.join(root, "index.html")


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = unquote(self.path.split("?", 1)[0].split("#", 1)[0])
        rel = path.lstrip("/")
        fs_path = os.path.join(root, rel)

        if os.path.isdir(fs_path):
          index = os.path.join(fs_path, "index.html")
          if os.path.exists(index):
            self.path = path.rstrip("/") + "/index.html"
            return super().do_GET()

        if os.path.exists(fs_path):
            return super().do_GET()

        if path.startswith("/s/") or path == "/" or not path.startswith("/assets/"):
            self.path = "/index.html"
            return super().do_GET()

        self.send_error(404, "File not found")

    def log_message(self, format, *args):
        return


ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
PY
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
