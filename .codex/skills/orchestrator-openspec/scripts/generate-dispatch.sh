#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
用途：
  生成子代理派单骨架。

用法：
  generate-dispatch.sh --role ROLE --goal TEXT [options]

必填参数：
  --role ROLE                 builder | explorer | verifier
  --goal TEXT                 当前任务目标

可选参数：
  --stage TEXT                当前阶段
  --model TEXT                主代理为该子代理选择的模型
  --change TEXT               所属 change 或任务包
  --spec-memory TEXT          当前规范记忆入口
  --exec-memory TEXT          当前执行记忆摘要
  --write-scope TEXT          写入范围
  --read-scope TEXT           审查边界或读取范围
  --blocked-by TEXT           前置依赖
  --deliverable TEXT          预期产物
  --acceptance TEXT           验收条件
  --experience TEXT           当前是否已有相关经验记忆
  --closure TEXT              本轮若发现高价值经验，是否需要回灌
  --no-responsibility TEXT    不负责什么
  -h, --help                  显示帮助

说明：
  该脚本只生成派单骨架，不负责自动判断角色、模型或执行顺序。
  输出会显式保留规范记忆、执行记忆和经验回灌入口。
EOF
}

role=""
goal=""
stage=""
model=""
change_ref=""
spec_memory=""
exec_memory=""
write_scope=""
read_scope=""
blocked_by=""
deliverable=""
acceptance=""
experience=""
closure=""
no_responsibility=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --role) role="${2:-}"; shift 2 ;;
    --goal) goal="${2:-}"; shift 2 ;;
    --stage) stage="${2:-}"; shift 2 ;;
    --model) model="${2:-}"; shift 2 ;;
    --change) change_ref="${2:-}"; shift 2 ;;
    --spec-memory) spec_memory="${2:-}"; shift 2 ;;
    --exec-memory) exec_memory="${2:-}"; shift 2 ;;
    --write-scope) write_scope="${2:-}"; shift 2 ;;
    --read-scope) read_scope="${2:-}"; shift 2 ;;
    --blocked-by) blocked_by="${2:-}"; shift 2 ;;
    --deliverable) deliverable="${2:-}"; shift 2 ;;
    --acceptance) acceptance="${2:-}"; shift 2 ;;
    --experience) experience="${2:-}"; shift 2 ;;
    --closure) closure="${2:-}"; shift 2 ;;
    --no-responsibility) no_responsibility="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "error: unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$role" || -z "$goal" ]]; then
  echo "error: --role and --goal are required" >&2
  usage >&2
  exit 1
fi

case "$role" in
  builder|explorer|verifier) ;;
  *)
    echo "error: unsupported role: $role" >&2
    exit 1
    ;;
esac

cat <<EOF
任务目标：$goal
当前阶段：${stage:-待主代理填写}
角色：$role
模型选择：${model:-待主代理填写}
所属 change 或任务包：${change_ref:-待主代理填写}
当前规范记忆入口：${spec_memory:-待主代理填写}
当前执行记忆摘要：${exec_memory:-待主代理填写}
写入范围：${write_scope:-待主代理填写}
审查边界：${read_scope:-待主代理填写}
前置依赖：${blocked_by:-待主代理填写}
预期产物：${deliverable:-待主代理填写}
验收条件：${acceptance:-待主代理填写}
当前是否已有相关经验记忆：${experience:-待主代理填写}
本轮若发现高价值经验，是否需要回灌：${closure:-待主代理填写}
不负责什么：${no_responsibility:-待主代理填写}
EOF
