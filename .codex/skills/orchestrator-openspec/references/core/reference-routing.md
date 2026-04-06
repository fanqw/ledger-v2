# 参考材料索引

这份索引只回答一个问题：

- 当前遇到的问题，应该先看哪一份材料

它不重复其他文档内容，只负责索引。

## 阅读分层

默认按这三层读取，不要跳级堆材料：

### 1. 起步必读

只在开始执行或刚接手任务时读：

- [../../SKILL.md](../../SKILL.md)
- [phase-gates.md](phase-gates.md)
- [main-agent-checklists.md](main-agent-checklists.md)
- [subagent-roles.md](subagent-roles.md)
- [dispatch-playbooks.md](dispatch-playbooks.md)
- [acceptance-patterns.md](acceptance-patterns.md)

### 2. 遇阻再读

只在当前推进受阻、边界不清或需要补骨架时读：

- [../execution/lightweight-task-boundaries.md](../execution/lightweight-task-boundaries.md)
- [../execution/opsx-audit-guide.md](../execution/opsx-audit-guide.md)
- [../execution/context-governance.md](../execution/context-governance.md)
- [../execution/context-packet-template.md](../execution/context-packet-template.md)
- [../execution/knowledge-closure.md](../execution/knowledge-closure.md)
- [../execution/evidence-records.md](../execution/evidence-records.md)

### 3. 深层设计

只在要理解系统设计、能力覆盖或准备继续扩展时读：

- [../architecture/memory-model.md](../architecture/memory-model.md)
- [../architecture/model-selection.md](../architecture/model-selection.md)
- [../architecture/non-delegable-decisions.md](../architecture/non-delegable-decisions.md)
- [../architecture/subagent-lifecycle.md](../architecture/subagent-lifecycle.md)
- [../architecture/subagent-announcement-templates.md](../architecture/subagent-announcement-templates.md)
- [../architecture/role-admission-rules.md](../architecture/role-admission-rules.md)
- [../architecture/goal-freeze-template.md](../architecture/goal-freeze-template.md)
- [../architecture/ui-iteration-rubric.md](../architecture/ui-iteration-rubric.md)

## 1. 不确定当前该不该启用这个 skill

先看：

- [../../SKILL.md](../../SKILL.md)

重点看：

- 何时使用
- 主代理职责

## 2. 不确定当前处于哪个阶段

先看：

- [phase-gates.md](phase-gates.md)

如果需要快速自检，再看：

- [main-agent-checklists.md](main-agent-checklists.md)

如果当前任务已经进入多轮推进，且你担心上下文失焦，再看：

- [../execution/context-governance.md](../execution/context-governance.md)
- [../architecture/memory-model.md](../architecture/memory-model.md)
- [../execution/stage-rollback-rules.md](../execution/stage-rollback-rules.md)

## 3. 不确定是否该进入 OpenSpec 流程

先看：

- [../../SKILL.md](../../SKILL.md)

如果需要判断当前 change 是否已可派单，再看：

- [../execution/opsx-audit-guide.md](../execution/opsx-audit-guide.md)
- [../execution/lightweight-task-boundaries.md](../execution/lightweight-task-boundaries.md)
- [../architecture/memory-model.md](../architecture/memory-model.md)

## 4. 不确定 OpenSpec 应该怎么推进

如果需要核查当前工件是否已足够支持实施，再看：

- [../execution/opsx-audit-guide.md](../execution/opsx-audit-guide.md)

## 5. 不确定该派哪类子代理

先看：

- [subagent-roles.md](subagent-roles.md)
- [dispatch-playbooks.md](dispatch-playbooks.md)

## 6. 不确定不同子代理该怎么选模型

先看：

- [../architecture/model-selection.md](../architecture/model-selection.md)

如果问题与子代理的启动、透明度或关闭有关，再看：

- [../architecture/subagent-lifecycle.md](../architecture/subagent-lifecycle.md)

如果需要统一对用户说明子代理状态的写法，再看：

- [../architecture/subagent-announcement-templates.md](../architecture/subagent-announcement-templates.md)

如果需要确认哪些决定不能外包，再看：

- [../architecture/non-delegable-decisions.md](../architecture/non-delegable-decisions.md)

## 7. 需要快速生成派单内容

先看：

- [../../prompts](../../prompts)
- [dispatch-playbooks.md](dispatch-playbooks.md)

如果任务属于 UI / UX / 内容引导类，再补：

- [../architecture/ui-iteration-rubric.md](../architecture/ui-iteration-rubric.md)

如果需要直接生成结构骨架，使用：

- `../../scripts/generate-dispatch.sh`

如果需要生成轮次收口后的续接骨架，使用：

- [../execution/context-packet-template.md](../execution/context-packet-template.md)
- `../../scripts/generate-context-packet.sh`

如果本轮经历了返工、验证失败或暴露新错误模式，再补：

- [../execution/knowledge-closure.md](../execution/knowledge-closure.md)

## 8. 不确定如何做验收或驳回

先看：

- [acceptance-patterns.md](acceptance-patterns.md)

如果需要快速生成验收骨架，使用：

- `../../scripts/generate-acceptance.sh`

如果需要统一证据记录与收口判断，再看：

- [../execution/evidence-records.md](../execution/evidence-records.md)

如果当前任务属于 skill / 文档 / 流程资产演化，再补：

- [../execution/evolution-acceptance-template.md](../execution/evolution-acceptance-template.md)

如果需要把本轮错误转成长期资产，再看：

- [../execution/knowledge-closure.md](../execution/knowledge-closure.md)

## 9. 不确定本轮主代理有没有漏检查项

先看：

- [main-agent-checklists.md](main-agent-checklists.md)

## 10. 想快速理解这套 skill 的最短阅读路径

推荐顺序：

1. [../../SKILL.md](../../SKILL.md)
2. [phase-gates.md](phase-gates.md)
3. [main-agent-checklists.md](main-agent-checklists.md)
4. [subagent-roles.md](subagent-roles.md)
5. [dispatch-playbooks.md](dispatch-playbooks.md)
6. [acceptance-patterns.md](acceptance-patterns.md)

如果当前任务明确属于中大型变更，再补：

7. [../execution/opsx-audit-guide.md](../execution/opsx-audit-guide.md)

如果当前任务是 UI / UX / 内容引导类，再补：

8. [../architecture/ui-iteration-rubric.md](../architecture/ui-iteration-rubric.md)

如果当前任务涉及多子代理协作，再补：

9. [../architecture/subagent-lifecycle.md](../architecture/subagent-lifecycle.md)
10. [../architecture/subagent-announcement-templates.md](../architecture/subagent-announcement-templates.md)

如果当前任务已经进入多轮推进，再补：

11. [../execution/context-governance.md](../execution/context-governance.md)
12. [../execution/context-packet-template.md](../execution/context-packet-template.md)

如果当前任务刚暴露新错误模式，再补：

13. [../execution/knowledge-closure.md](../execution/knowledge-closure.md)

## 11. 不要怎么用这份索引

- 不要把它当完整说明书
- 不要跳过主文档直接只看索引
- 不要一次性把所有参考材料都读进上下文
- 不要把深层设计材料当成第一次执行的必读项

重点是：先定位问题，再读取最小必要材料。
