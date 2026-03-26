#!/bin/zsh

cd "/Users/alex/Desktop/PROVA CODEX" || exit 1

export PATH="/opt/homebrew/bin:$PATH"

if lsof -tiTCP:3000 >/dev/null 2>&1; then
  kill "$(lsof -tiTCP:3000)" 2>/dev/null
  sleep 1
fi

nohup npm run dev -- --hostname 127.0.0.1 --port 3000 >/tmp/konexa-dev.log 2>&1 &

sleep 4

open "http://127.0.0.1:3000"
