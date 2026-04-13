#!/bin/bash
# ============================================================
#  本地一键远程发版_ouo
#  用法: ./local-deploy.sh [分支名]
#  示例: ./local-deploy.sh main
# ============================================================
set -e

# -------------------- 配置区 --------------------
SERVER_HOST="124.156.186.82"
SERVER_USER="root"
SERVER_PORT=22
REMOTE_DEPLOY_SCRIPT="/opt/deploy/ouo/deploy.sh"
SERVER_KEY="$HOME/.ssh/id_ed25519"

BRANCH="${1:-main}"
# -----------------------------------------------------------

echo "🚀 远程发版: $SERVER_USER@$SERVER_HOST 分支: $BRANCH"
ssh -i "$SERVER_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "bash $REMOTE_DEPLOY_SCRIPT $BRANCH"
echo "✅ 发版完成"
