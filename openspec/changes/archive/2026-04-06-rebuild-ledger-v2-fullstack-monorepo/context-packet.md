【当前推进状态】
当前轮唯一目标：完成 ledger-v2 全栈 monorepo 首版重构并形成可归档的验收状态
当前阶段：Acceptance & Verification
当前完成情况：已完成 workspace、apps/web、shared DTO、Prisma schema、会话鉴权、Route Handlers、核心页面、根级文档与容器配置；并通过 db:generate/typecheck/test/lint/build；运行时已完成登录、会话、分类/单位/商品/订单/订单明细创建与订单汇总读取冒烟验证
当前阻塞项：无当前阻塞
当前验证目标：补浏览器级链路验收，再评估 archive
下一步：用浏览器完成页面级 CRUD 冒烟和 UI 验收，然后准备 archive

【规范记忆落点】
当前 change / 规格入口：openspec/changes/rebuild-ledger-v2-fullstack-monorepo/
当前任务包来源：openspec/changes/rebuild-ledger-v2-fullstack-monorepo/tasks.md
当前保留约束：继续以单一 Next.js 全栈应用为主；不兼容 v1 API；不迁移历史 Mongo 数据；首版保持单角色后台
当前规范记忆是否稳定：是

【执行记忆落点】
当前执行记忆包位置：openspec/changes/rebuild-ledger-v2-fullstack-monorepo/context-packet.md
下一轮续接时最先看的信息：优先查看本 change 的 tasks、acceptance 和 context packet
当前是否需要阶段回退：否

【经验记忆落点】
本轮是否新增经验记忆：有
新增经验摘要：启用 Next typedRoutes 后，router/link 的动态路径需要显式收窄为 Route 类型；同时，订单类 GET Route Handler 若未显式关闭缓存，会在新增明细后返回过期汇总，需要设置 dynamic force-dynamic
经验落点：当前 change 上下文、后续 Next.js 工程实践与 API 缓存策略
是否需要进入知识闭环：暂不需要
