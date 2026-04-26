#!/bin/bash
# Watch .tex/.bib files and rebuild on change.
# Press 'r' to reload Evince when it freezes, 'q' to quit.

set -u
shopt -s nullglob

VARIANT="${1:-prace-full}"
DEBOUNCE=5
BUILD_TIMEOUT=120
VIEWER_CMD=(env -u GTK_PATH -u GTK_EXE_PREFIX -u GTK_IM_MODULE_FILE -u GIO_MODULE_DIR -u LOCPATH -u GSETTINGS_SCHEMA_DIR evince)
BUILD_PID=""
VIEWER_PID=""
LOCK_FILE=""

cd "$(dirname "$0")"

WATCH_EVENTS="modify,close_write,moved_to,create,delete"
WATCH_DIRS=( . generated )
WATCH_INCLUDE='.*\.(tex|bib)$'
LOCK_FILE=".watch-${VARIANT}.lock"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
    echo "✗ Watch for ${VARIANT} is already running."
    exit 1
fi

kill_descendants() {
    local pid="$1"
    local child

    for child in $(pgrep -P "$pid" 2>/dev/null || true); do
        kill_descendants "$child"
    done

    kill "$pid" 2>/dev/null || true
}

stop_build() {
    if [[ -n "$BUILD_PID" ]] && kill -0 "$BUILD_PID" 2>/dev/null; then
        kill_descendants "$BUILD_PID"
        wait "$BUILD_PID" 2>/dev/null || true
    fi
    BUILD_PID=""
}

stop_viewer() {
    if [[ -n "$VIEWER_PID" ]] && kill -0 "$VIEWER_PID" 2>/dev/null; then
        kill "$VIEWER_PID" 2>/dev/null || true
        wait "$VIEWER_PID" 2>/dev/null || true
    fi
    pkill -f "evince.*${VARIANT}\.pdf" 2>/dev/null || true
    VIEWER_PID=""
}

cleanup() {
    trap - INT TERM EXIT
    stop_build
    stop_viewer
    if [[ -n "${INOTIFY_PID:-}" ]] && kill -0 "$INOTIFY_PID" 2>/dev/null; then
        kill "$INOTIFY_PID" 2>/dev/null || true
        wait "$INOTIFY_PID" 2>/dev/null || true
    fi
    exec 8<&- 2>/dev/null || true
    rm -f "$LOCK_FILE"
}

trap cleanup INT TERM EXIT

open_viewer() {
    stop_viewer
    "${VIEWER_CMD[@]}" "${VARIANT}.pdf" 2>/dev/null &
    VIEWER_PID=$!
}

build_variant() {
    local status

    timeout --foreground "${BUILD_TIMEOUT}s" make -s "$VARIANT" &
    BUILD_PID=$!
    wait "$BUILD_PID"
    status=$?
    BUILD_PID=""

    if [[ $status -eq 124 ]]; then
        echo "✗ Build timed out after ${BUILD_TIMEOUT}s, killed."
    elif [[ $status -ne 0 ]]; then
        echo "✗ Build exited with status ${status}."
    fi

    return 0
}

build_variant
open_viewer

exec 8< <(
    inotifywait -m -q -e "$WATCH_EVENTS" \
        --format '%w%f %e' \
        --include "$WATCH_INCLUDE" \
        "${WATCH_DIRS[@]}" 2>/dev/null
)
INOTIFY_PID=$!

echo "Watching .tex/.bib files (${DEBOUNCE}s debounce, timeout ${BUILD_TIMEOUT}s)..."
echo "  r = reload Evince | q = quit | Ctrl+C = stop cleanly"
echo ""

while true; do
    if read -rsn1 -t 0.2 key; then
        case "$key" in
            r|R)
                open_viewer
                echo "✓ Evince reloaded"
                ;;
            q|Q)
                echo "Bye"
                exit 0
                ;;
        esac
    fi

    if read -r -t 0.2 _event <&8; then
        while read -r -t "$DEBOUNCE" _event <&8; do :; done
        echo "--- Rebuilding $VARIANT ---"
        build_variant
    fi
done
