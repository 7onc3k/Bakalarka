#!/bin/bash
# Interaktivní shell v agent containeru — pro auth a debugging
# Použití: ./infra/scripts/agent-shell.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INFRA_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
AUTH_DIR="$INFRA_DIR/opencode-auth"
CONFIG_DIR="$INFRA_DIR/opencode-config"

mkdir -p "$AUTH_DIR"
mkdir -p "$AUTH_DIR/state"

docker run --rm -it \
  --user "$(id -u):$(id -g)" \
  -v "$AUTH_DIR:/home/ubuntu/.local/share/opencode" \
  -v "$AUTH_DIR/state:/home/ubuntu/.local/state" \
  -v "$CONFIG_DIR:/home/ubuntu/.config/opencode" \
  -e HOME=/home/ubuntu \
  bp-agent:latest \
  bash
