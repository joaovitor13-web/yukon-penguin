#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v docker >/dev/null || { echo 'Instale Docker Engine e Docker Compose.' >&2; exit 1; }
docker compose version >/dev/null
case "${1:-help}" in
  build)
    git submodule update --init --recursive
    if [[ ! -d assets/media ]]; then
      node scripts/import-assets.cjs resources/yukon-assets
    fi
    node scripts/check-assets.cjs
    docker compose build
    ;;
  start) docker compose up -d --wait ;;
  stop) docker compose stop ;;
  status) docker compose ps ;;
  logs) docker compose logs --tail=100 -f ;;
  create|reset-password)
    test "$#" -eq 2 || { echo 'Informe o nome da conta.' >&2; exit 1; }
    docker compose exec login node local/accounts.cjs "$1" "$2"
    ;;
  backup)
    umask 077
    mkdir -p backups
    backup="backups/yukon-$(date -u +%Y%m%dT%H%M%SZ).sql"
    tmp=$(mktemp backups/.backup.XXXXXX)
    trap 'rm -f "$tmp"' EXIT
    docker compose exec -T db sh -c 'MYSQL_PWD="$MARIADB_ROOT_PASSWORD" mariadb-dump -uroot --single-transaction --routines --triggers --events yukon' > "$tmp"
    test -s "$tmp"
    mv "$tmp" "$backup"
    echo "Backup criado: $backup"
    ;;
  *) echo 'Uso: bash scripts/local.sh build|start|stop|status|logs|create NOME|reset-password NOME|backup' ;;
esac
