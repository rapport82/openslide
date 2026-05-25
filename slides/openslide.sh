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

filter_chunk_warning() {
  python3 -c '
import sys

skip = 0
for line in sys.stdin:
    if line.startswith("(!) Some chunks are larger than 500 kB after minification. Consider:"):
        skip = 3
        continue
    if skip:
        skip -= 1
        continue
    sys.stdout.write(line)
'
}

run_build() {
  log "building static bundle"
  cd "${ROOT_DIR}"
  pnpm exec open-slide build --out-dir "${DIST_DIR}/app" 2>&1 | filter_chunk_warning
}

run_publish() {
  ensure_index
  rm -rf "${DIST_DIR}"
  run_build

  mkdir -p "${DIST_DIR}"
  if [[ -d "${DIST_DIR}/app/assets" ]]; then
    cp -R "${DIST_DIR}/app/assets" "${DIST_DIR}/assets"
  fi
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


class Handler(SimpleHTTPRequestHandler):
    def serve_file(self, file_path):
        try:
            with open(file_path, "rb") as f:
                data = f.read()
        except OSError:
            self.send_error(404, "File not found")
            return

        self.send_response(200)
        self.send_header("Content-type", self.guess_type(file_path))
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

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

        if path == "/":
            return self.serve_file(os.path.join(root, "index.html"))

        if path.startswith("/s/assets/"):
            asset_rel = path[len("/s/"):]
            asset_path = os.path.join(root, asset_rel)
            if os.path.exists(asset_path):
                return self.serve_file(asset_path)

        if path.startswith("/s/"):
            return self.serve_file(os.path.join(root, "app", "index.html"))

        if not path.startswith("/assets/"):
            return self.serve_file(os.path.join(root, "index.html"))

        self.send_error(404, "File not found")

    def log_message(self, format, *args):
        return


ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
PY
}

run_ship() {
  local message="${1:-Update slides}"
  local branch
  branch="$(git -C "${ROOT_DIR}" branch --show-current)"

  ensure_index
  run_publish

  cd "${ROOT_DIR}"
  git add -A

  push_current_branch() {
    if git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
      git push
    else
      git push --set-upstream origin "${branch}"
    fi
  }

  if git diff --cached --quiet; then
    if git rev-list --quiet --count origin/main..HEAD >/dev/null 2>&1 && [[ "$(git rev-list --count origin/main..HEAD)" != "0" ]]; then
      log "nothing new to commit; pushing existing local commits"
      push_current_branch
      log "pushed to origin"
      exit 0
    fi

    log "nothing to commit"
    exit 0
  fi

  git commit -m "${message}"
  push_current_branch
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
