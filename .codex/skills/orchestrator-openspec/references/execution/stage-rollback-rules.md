# 阶段回退规则

这份文档回答一个问题：

- 阶段切换失败时，主代理应该回退到哪里

## 总原则

- 发现失败，不继续硬推下一阶段
- 优先回退到最近一个仍能解决问题的阶段
- 回退后先修复进入条件，再重新推进

## 1. Intent Lock 回退

如果目标、成功标准、范围仍然不清楚：

- 不进入下一阶段
- 保持在 `Intent Lock`

## 2. Solution Exploration 回退

如果方案仍有关键未知项，或多个方案尚未完成裁定：

- 保持在 `Solution Exploration`
- 不进入 `Decision & Brief Freeze`

## 3. Decision & Brief Freeze 回退

满足任一情况时，回退到 `Solution Exploration` 或留在当前阶段：

- proposal / design / tasks 仍不完整
- 当前任务包无法稳定派发
- 发现前面方案裁定依赖错误

回退规则：

- 缺字段、缺约束：留在 `Decision & Brief Freeze`
- 方案方向本身不成立：回退到 `Solution Exploration`

## 4. Parallel Execution 回退

满足任一情况时，不继续扩大执行面：

- 任务包本身有缺陷
- 子代理解决的是错误问题
- 依赖关系与执行顺序判断错误

回退规则：

- 派单字段有缺陷：回退到 `Decision & Brief Freeze`
- 方案本身有争议：回退到 `Solution Exploration`

## 5. Acceptance & Verification 回退

满足任一情况时，不能直接收口：

- 独立验证失败
- 证据不足
- 规格与实现明显偏离

回退规则：

- 实现细节问题：回到 `Parallel Execution`
- 任务包验收标准本身不清：回到 `Decision & Brief Freeze`
- 规格方向争议：回到 `Solution Exploration`

## 6. Archive & Reporting 回退

满足任一情况时，不应算本轮结束：

- 最小证据链不完整
- 轮次总结无法支撑下一轮续接
- 仍有未解除的关键阻塞项却被误判为收口

回退规则：

- 缺归档与总结：留在 `Archive & Reporting`
- 发现前一阶段裁定错误：回退到 `Acceptance & Verification`
