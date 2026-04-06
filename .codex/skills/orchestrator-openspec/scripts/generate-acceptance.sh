#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
用途：
  生成主代理验收骨架。

用法：
  generate-acceptance.sh --status STATUS [options]

必填参数：
  --status STATUS             accepted | revise | blocked

可选参数：
  --goal TEXT                当前任务目标
  --change TEXT              所属 change 或任务包
  --summary TEXT             一句话结论
  --evidence TEXT            关键证据
  --next-step TEXT           下一步动作
  --problem TEXT             问题点（常用于 revise）
  --reason TEXT              原因说明
  --blocker TEXT             阻塞项（常用于 blocked）
  --new-learning TEXT        是否暴露了新的错误模式或经验
  --learning-target TEXT     经验落点
  --closure TEXT             是否需要进入知识闭环
  -h, --help                 显示帮助

说明：
  该脚本只生成验收骨架，不负责自动裁定状态。
EOF
}

status=""
goal=""
change_ref=""
summary=""
evidence=""
next_step=""
problem=""
reason=""
blocker=""
new_learning=""
learning_target=""
closure=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --status) status="${2:-}"; shift 2 ;;
    --goal) goal="${2:-}"; shift 2 ;;
    --change) change_ref="${2:-}"; shift 2 ;;
    --summary) summary="${2:-}"; shift 2 ;;
    --evidence) evidence="${2:-}"; shift 2 ;;
    --next-step) next_step="${2:-}"; shift 2 ;;
    --problem) problem="${2:-}"; shift 2 ;;
    --reason) reason="${2:-}"; shift 2 ;;
    --blocker) blocker="${2:-}"; shift 2 ;;
    --new-learning) new_learning="${2:-}"; shift 2 ;;
    --learning-target) learning_target="${2:-}"; shift 2 ;;
    --closure) closure="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "error: unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$status" ]]; then
  echo "error: --status is required" >&2
  usage >&2
  exit 1
fi

case "$status" in
  accepted|revise|blocked) ;;
  *)
    echo "error: unsupported status: $status" >&2
    exit 1
    ;;
esac

cat <<EOF
裁定：$status
任务目标：${goal:-待主代理填写}
所属 change 或任务包：${change_ref:-待主代理填写}
结论：${summary:-待主代理填写}
问题：${problem:-待主代理填写}
原因：${reason:-待主代理填写}
阻塞项：${blocker:-待主代理填写}
依据：${evidence:-待主代理填写}
下一步：${next_step:-待主代理填写}
是否暴露新经验：${new_learning:-待主代理填写}
经验落点：${learning_target:-待主代理填写}
是否需要进入知识闭环：${closure:-待主代理填写}
EOF
