---
name: orchestrator-openspec
description: 当一个主代理需要对中大型交付任务负最终责任时使用。该 skill 强制主代理按阶段门禁推进，并通过 OpenSpec 的原生命令与 change/spec 工件做 SDD 驱动，不允许子代理绕过规格直接自由发挥。
---

# 主代理编排 + OpenSpec SDD

如果需要先找“当前问题对应哪份材料”，先看 [references/core/reference-routing.md](references/core/reference-routing.md)。

这份主文档只保留最小协议：

- 什么情况下启用
- 主代理必须负责什么
- 阶段、角色、裁定和记忆的最小边界是什么

如果只是要开始执行，不要一次读完所有 reference，按 [references/core/reference-routing.md](references/core/reference-routing.md) 做最小读取。

## 何时使用

满足任一条件时启用：

- 任务跨 3 个以上文件
- 任务跨 2 个以上子系统
- 需要多个子代理并行
- 需要先讨论方案再实施
- 预期会有多轮返工或多轮验收
- 涉及 UX、接口、架构、流程或长期规则变化

小型、单文件、直接可做的任务不要使用这个 skill。

## 主代理职责

主代理是唯一最终责任人。

主代理必须负责：

- 用一句话锁定目标
- 明确成功标准、范围、约束
- 判断是否进入 OpenSpec 流程
- 决定先做什么、后做什么、哪些可并行
- 根据规格派发子代理任务
- 审核所有子代理结果
- 触发独立验证
- 必要时亲自下场复核
- 记录证据链、轮次总结和记忆落点

子代理不得决定全局方向。

## 用户决策时机

这套 skill 默认由主代理主动推进，不应在每个阶段都把普通执行选择抛给用户。

主代理默认自己处理：

- 阶段判断
- 角色选择
- 任务拆分
- 派单顺序
- 独立验证安排
- 证据是否足以支持常规裁定

主代理只在高价值节点主动询问用户：

- `Intent Lock`
  - 通常需要用户确认一次目标、范围和成功标准
- `Solution Exploration`
  - 只在存在明显方案分叉时询问用户
- `Decision & Brief Freeze`
  - 通常只需要用户确认大方向是否接受
- `Parallel Execution`
  - 一般不频繁打断用户
- `Acceptance & Verification`
  - 只在结果有争议，或质量取舍不明显时请用户拍板
- `Archive & Reporting`
  - 一般不需要用户决策

如果当前问题只是执行细节，而不是方向、范围、取舍或最终接受标准，主代理不应上抛给用户。

## 六阶段

严格按这六个阶段推进：

1. `Intent Lock`
2. `Solution Exploration`
3. `Decision & Brief Freeze`
4. `Parallel Execution`
5. `Acceptance & Verification`
6. `Archive & Reporting`

详细门禁见 [references/core/phase-gates.md](references/core/phase-gates.md)。  
阶段检查项见 [references/core/main-agent-checklists.md](references/core/main-agent-checklists.md)。  
如果阶段切换失败，回退规则见 [references/execution/stage-rollback-rules.md](references/execution/stage-rollback-rules.md)。

## OpenSpec 规则

这套 skill 不自己发明伪 OpenSpec 流程。  
中大型变更优先使用 OpenSpec 原生命令与工件推进规格。

使用前至少确认：

1. 已安装 OpenSpec
2. 当前项目已执行 `openspec init`
3. 当前环境已完成 `openspec artifact-experimental-setup`
4. 如有需要，已执行 `openspec update`

推荐先检查：

- `openspec --version`
- 仓库根目录是否存在 `openspec/`
- 当前环境是否能使用 `opsx:*` 命令

如果缺失，先补 OpenSpec CLI、`openspec init`、`openspec artifact-experimental-setup`、`openspec update`，再进入规格阶段。

主代理不能跳过 OpenSpec 规格而直接派发 `builder`，除非当前任务被判定为轻量任务。  
边界判断见 [references/execution/lightweight-task-boundaries.md](references/execution/lightweight-task-boundaries.md)。  
OpenSpec 审查与派单说明见 [references/execution/opsx-audit-guide.md](references/execution/opsx-audit-guide.md)。

## 标准角色

只使用这三类标准角色：

- `builder`
- `explorer`
- `verifier`

角色定义见 [references/core/subagent-roles.md](references/core/subagent-roles.md)。  
生命周期见 [references/architecture/subagent-lifecycle.md](references/architecture/subagent-lifecycle.md)。  
角色扩展边界见 [references/architecture/role-admission-rules.md](references/architecture/role-admission-rules.md)。  
不可外包决定见 [references/architecture/non-delegable-decisions.md](references/architecture/non-delegable-decisions.md)。

主代理可按任务复杂度、关键路径、读写范围和上下文需求选择不同模型。  
模型选择见 [references/architecture/model-selection.md](references/architecture/model-selection.md)。  
如果需要统一对子代理的可见说明，见 [references/architecture/subagent-announcement-templates.md](references/architecture/subagent-announcement-templates.md)。

## 派单与验收底线

派单必须来自当前 OpenSpec 任务工件，而不是纯口头自由 briefing。

每个任务包至少要明确：

- 任务名
- 负责人角色
- 写入范围
- 前置依赖
- 预期产物
- 验收条件
- 是否可并行

主代理验收至少检查：

1. 是否符合最初目标
2. 是否符合当前规格
3. 是否完成任务包要求
4. 是否有证据回链
5. 是否通过独立验证

只允许三种正式裁定：

- `accepted`
- `revise`
- `blocked`

派单剧本见 [references/core/dispatch-playbooks.md](references/core/dispatch-playbooks.md)。  
派单模板见 [prompts](prompts)。  
验收模式见 [references/core/acceptance-patterns.md](references/core/acceptance-patterns.md)。

## 三类记忆

这套 skill 默认同时维护三类记忆：

- 规范记忆：当前 change、spec、tasks 与稳定约束
- 执行记忆：当前轮目标、阶段、任务包、阻塞项、验证状态、下一步
- 经验记忆：本轮新暴露的错误模式、修正策略、后续应复用的经验

默认落点：

- OpenSpec 工件承载规范记忆
- 上下文包与轮次收口承载执行记忆
- 知识闭环承载经验记忆

记忆模型见 [references/architecture/memory-model.md](references/architecture/memory-model.md)。  
知识闭环见 [references/execution/knowledge-closure.md](references/execution/knowledge-closure.md)。  
统一续接记录见 [references/execution/context-packet-template.md](references/execution/context-packet-template.md) 与 `scripts/generate-context-packet.sh`。

## 证据与归档底线

默认按低成本证据优先：

1. 路由、文案、链接、DOM、diff
2. class、布局、滚动区、宽度约束
3. build、start、curl、测试
4. 局部截图
5. 整页截图

截图不是默认输入。只有视觉问题才使用，而且优先局部截图。

每轮至少要能指出：

- 当前 change 或规格入口
- 当前任务包来源
- 验收结果
- 轮次总结
- 当前验证目标或预览地址

证据记录见 [references/execution/evidence-records.md](references/execution/evidence-records.md)。

## 只在需要时再读

以下材料只在需要时再读：

- 目标冻结：[references/architecture/goal-freeze-template.md](references/architecture/goal-freeze-template.md)
- UI 迭代：[references/architecture/ui-iteration-rubric.md](references/architecture/ui-iteration-rubric.md)

这个 skill 负责主代理编排方法，不负责替代 OpenSpec 本身的文档系统。
