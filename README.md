# ledger-v2

`ledger-v2` 是基于 `v1` 参考实现重构的新一代账务/对账系统代码库。当前仓库以 `v1/` 作为历史实现对照，`v2` 的目标是在保留既有业务范围的前提下，升级为更易维护、可测试、可容器化交付的现代全栈架构。

## 重构目标

- 以全栈 Web 应用替代 `v1` 的前后端分离实现。
- 在单仓多包结构下统一管理应用、共享代码与工程配置。
- 统一 TypeScript、代码规范、容器化开发与交付流程。
- 逐步迁移 `v1` 现有业务能力，包括登录、分类、单位、商品、订单、订单明细。

## 仓库结构

当前目录约定如下：

- `v1/`：历史源码，仅用于对照、迁移和需求核对，不再承载长期维护代码。
- `apps/web`：`v2` 全栈 Web 主应用，承载页面路由、服务端接口、鉴权接入与业务编排。
- `packages/shared`：共享类型、常量、工具函数、领域模型约束。
- `packages/config`：共享 ESLint、TypeScript、Prettier、Tailwind 等工程配置。

仓库采用 `pnpm workspace` 组织。除 `v1/`、应用目录和共享包目录外，根目录只保留工作区级配置、Docker 配置、CI 配置和文档。

## 技术栈

| 层级 | 技术 |
|------|------|
| 仓库与包管理 | pnpm workspace |
| 全栈应用 | Next.js（App Router）、React、TypeScript |
| UI 与客户端状态 | Tailwind CSS、Redux、Axios |
| 数据访问与基础设施 | Prisma、PostgreSQL、Redis |
| 代码规范 | ESLint、Prettier |
| 本地编排与交付 | Docker、Docker Compose |

默认采用单一全栈应用承载页面、服务端逻辑与数据访问编排。仅在出现明确拆分收益时，才新增独立服务或额外包。

## First Run

全仓统一使用 `pnpm` 作为依赖管理和脚本入口。按下面的顺序即可完成一次从零启动：

1. `pnpm install`：安装工作区依赖。
2. `docker compose up -d postgres redis`：启动 PostgreSQL 和 Redis。
3. `pnpm run db:generate`：生成 Prisma Client。
4. `pnpm run db:migrate`：执行本地 Prisma 迁移。
5. `pnpm --filter web prisma:seed`：初始化默认管理员账号。
6. `pnpm run dev`：启动 `apps/web` 开发环境，或在发布场景中使用 `pnpm run build` 和 `pnpm run start`。
7. `pnpm run lint`、`pnpm run test`、`pnpm run build`：执行代码检查、测试和构建验证。
8. 浏览器级校验前执行 `pnpm --filter web playwright:install` 安装 Chromium。
9. 执行 `pnpm --filter web smoke:e2e` 进行登录与核心 CRUD 浏览器冒烟校验。

如果直接使用 `docker compose up` 启动完整容器栈，`web` 容器会先自动执行 `pnpm --filter web db:init`，其中包含 `prisma migrate deploy` 和 `prisma:seed`，再启动 Next.js。

常用入口也保留在根脚本中：

- `pnpm --filter web dev`：仅启动全栈 Web 应用。
- `pnpm run format`：运行 Prettier 格式化。
- `pnpm run start`：启动生产模式的全栈 Web 应用。

## Environment

`v2` 默认依赖以下基础设施：

- PostgreSQL：主业务数据存储。
- Redis：缓存、会话、限流或异步辅助能力。
- Docker Compose：本地开发和 CI/CD 中统一拉起依赖环境。
- 本地环境变量：请基于 `.env.example` 复制并按实际环境补齐 `DATABASE_URL`、`REDIS_URL` 和 `SESSION_SECRET`。

后续新增环境变量、镜像标签、服务端口、数据卷或初始化脚本时，必须同步更新本文档。

## Validation

新增业务逻辑时，应在同一变更或紧密相关的提交中补充测试。测试应覆盖：

- 页面或组件关键交互。
- 服务端业务逻辑与接口行为。
- 数据访问层的核心查询或约束。

测试目录可以放在各包约定位置或统一的 `tests/` 下，但命名应与被测模块保持清晰对应。当前推荐的验证顺序是 `db:generate`、`db:migrate`、`prisma:seed`、`lint`、`test`、`build`，再做浏览器级冒烟。

## v1 与 v2 边界

- `v1` 仅作参考，不继续承载新功能。
- `v2` 的实现、文档、配置、测试和部署方案都应写在新的工作区结构中。
- 从 `v1` 迁移业务时，应优先复用业务语义和数据关系，不直接复制旧实现中的工程结构和历史问题。

## Commands

- `pnpm install`：安装依赖。
- `pnpm run dev`：启动默认开发环境。
- `pnpm --filter web dev`：仅启动全栈 Web 应用。
- `pnpm run build`：构建全仓或根脚本定义的应用。
- `pnpm run lint`：运行 ESLint 检查。
- `pnpm run format`：运行 Prettier 格式化。
- `pnpm run test`：运行测试。
- `pnpm run db:generate`：生成 Prisma Client。
- `pnpm run db:migrate`：执行 Prisma 迁移。
- `pnpm --filter web db:init`：在生产启动前执行迁移并初始化默认管理员。
- `pnpm --filter web prisma:seed`：初始化默认管理员账号。
- `pnpm --filter web playwright:install`：安装 Playwright Chromium 浏览器。
- `pnpm --filter web smoke:e2e`：执行浏览器级核心链路冒烟测试。
- `docker compose up -d postgres redis`：启动基础设施。
- `docker compose up`：启动完整容器栈，并在 `web` 容器启动前自动完成数据库初始化。

## 文档维护

当以下内容发生变化时，必须同步更新 `README.md` 与 `AGENTS.md`：

- 目录结构
- 技术栈
- 环境变量
- 开发、构建、测试、部署命令
- `v1` / `v2` 的边界说明
