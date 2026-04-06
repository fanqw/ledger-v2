#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
用途：
  生成长任务续接所需的统一上下文包。

用法：
  generate-context-packet.sh --goal TEXT --stage TEXT [options]

必填参数：
  --goal TEXT              当前轮唯一目标
  --stage TEXT             当前阶段

可选参数：
  --change TEXT            当前 change 或规格入口
  --task-source TEXT       当前任务包来源
  --completed TEXT         当前完成情况
  --blocked TEXT           当前阻塞项
  --constraints TEXT       当前保留约束
  --validation TEXT        当前验证目标
  --next-step TEXT         下一步
  --memory-packet TEXT     当前执行记忆包位置
  --resume-from TEXT       下一轮续接时最先看的信息
  --rollback TEXT          当前是否需要阶段回退
  --memory-stable TEXT     当前规范记忆是否稳定
  --new-learning TEXT      本轮是否新增经验记忆
  --learning-summary TEXT  新增经验摘要
  --learning-target TEXT   经验落点
  --closure TEXT           是否需要进入知识闭环
  -h, --help               显示帮助

说明：
  该脚本生成统一上下文包，用于轮次收口、下一轮续接和快速上下文恢复。
  输出会显式指出规范记忆、执行记忆和经验记忆的落点。
EOF
}

goal=""
stage=""
change_ref=""
task_source=""
completed=""
blocked=""
constraints=""
validation=""
next_step=""
memory_packet=""
resume_from=""
rollback=""
memory_stable=""
new_learning=""
learning_summary=""
learning_target=""
closure=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --goal) goal="${2:-}"; shift 2 ;;
    --stage) stage="${2:-}"; shift 2 ;;
    --change) change_ref="${2:-}"; shift 2 ;;
    --task-source) task_source="${2:-}"; shift 2 ;;
    --completed) completed="${2:-}"; shift 2 ;;
    --blocked) blocked="${2:-}"; shift 2 ;;
    --constraints) constraints="${2:-}"; shift 2 ;;
    --validation) validation="${2:-}"; shift 2 ;;
    --next-step) next_step="${2:-}"; shift 2 ;;
    --memory-packet) memory_packet="${2:-}"; shift 2 ;;
    --resume-from) resume_from="${2:-}"; shift 2 ;;
    --rollback) rollback="${2:-}"; shift 2 ;;
    --memory-stable) memory_stable="${2:-}"; shift 2 ;;
    --new-learning) new_learning="${2:-}"; shift 2 ;;
    --learning-summary) learning_summary="${2:-}"; shift 2 ;;
    --learning-target) learning_target="${2:-}"; shift 2 ;;
    --closure) closure="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "error: unknown argument: $1" >&2; usage >&2; exit 1 ;;
  esac
done

if [[ -z "$goal" || -z "$stage" ]]; then
  echo "error: --goal and --stage are required" >&2
  usage >&2
  exit 1
fi

cat <<EOF
【当前推进状态】
当前轮唯一目标：$goal
当前阶段：$stage
当前完成情况：${completed:-待主代理填写}
当前阻塞项：${blocked:-待主代理填写}
当前验证目标：${validation:-待主代理填写}
下一步：${next_step:-待主代理填写}

【规范记忆落点】
当前 change / 规格入口：${change_ref:-待主代理填写}
当前任务包来源：${task_source:-待主代理填写}
当前保留约束：${constraints:-待主代理填写}
当前规范记忆是否稳定：${memory_stable:-待主代理填写}

【执行记忆落点】
当前执行记忆包位置：${memory_packet:-待主代理填写}
下一轮续接时最先看的信息：${resume_from:-待主代理填写}
当前是否需要阶段回退：${rollback:-待主代理填写}

【经验记忆落点】
本轮是否新增经验记忆：${new_learning:-待主代理填写}
新增经验摘要：${learning_summary:-待主代理填写}
经验落点：${learning_target:-待主代理填写}
是否需要进入知识闭环：${closure:-待主代理填写}
EOF
