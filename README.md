# MangaCanvas

基于 React + TypeScript + Vite 的漫画创作管理平台原型，包含项目工作台、资产管理、成员管理、Infinite Canvas 工作流，以及一套已经落地的轻量请求层。

## 快速开始

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:5174`

常用命令：

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## 当前技术栈

- React 18
- TypeScript 5
- Vite 5
- React Router DOM 6
- Zustand
- Tailwind CSS
- Radix UI / shadcn 风格基础组件
- Ant Design
- Axios `1.14.0`
- React Flow

## 当前路由

以下内容以 [src/App.tsx](/Users/hanqian/My_/my_code/jurilu/src/App.tsx) 为准：

| 路径 | 页面 |
|------|------|
| `/` | Home |
| `/login` | Login |
| `/pricing` | Pricing |
| `/gallery` | Gallery |
| `/workflow` | Workflow |
| `/terms` | Terms |
| `/privacy` | Privacy |
| `/contact` | Contact |
| `/dashboard` | Dashboard |
| `/project/:id/dashboard` | Dashboard |
| `/projects` | ProjectsList |
| `/project/:id` | ProjectDetail |
| `/project/:id/:tab` | ProjectDetail |
| `/project/:projectId/episode/:episodeId` | EpisodeDetail |
| `/project/:projectId/episode/:episodeId/canvas` | WorkflowCanvas |
| `/project/:projectId/workflows/:workflowId` | WorkflowCanvas |
| `/project/:projectId/permissions` | ProjectPermissions |
| `/members` | Members |
| `/assets` | Assets |

补充说明：

- `IdentityRouteGuard` 已启用。
- 当前身份如果没有项目权限，例如“新成员”，访问 `/dashboard` 或 `/project/*` 会被重定向到 `/projects`。

## 当前功能概览

这里描述的是“代码里现在确实存在的能力”，不再区分愿景和计划中功能。

- Landing Page：营销首页、价格页、工作流介绍、画廊、条款、隐私、联系页
- 登录页：Mock 登录，登录态写入本地存储
- Dashboard：项目看板/快速入口
- ProjectsList：项目列表、通知抽屉、用户菜单、身份切换
- ProjectDetail：项目工作台壳层
- 项目 tab：片段、角色、场景、物品、工作流
- 场景/角色/片段/物品创建器：以弹框/抽屉形式存在
- ProjectPermissions：项目权限管理页
- Members：成员管理页
- Assets：资产管理页，支持看板/列表切换
- Infinite Canvas：基于 React Flow 的工作流画布，包含图像/视频/文本/效果节点
- 统一反馈系统：全局 toast + confirm 弹窗

## 当前状态管理

- `src/stores/projectStore.ts`
  - 管理项目工作台中的片段、场景、角色、物品
  - 当前以本地 mock 数据和同步 CRUD 为主
- `src/features/infinite-canvas/stores/`
  - 管理 Infinite Canvas 的项目、主题、画布状态
- `src/components/feedback/FeedbackProvider.tsx`
  - 提供 `notify` 和 `confirm`
- `src/lib/mock-identities.ts`
  - 管理身份模拟、权限能力与身份切换事件

## 项目结构

下面是当前仓库中更接近真实情况的结构摘要：

```text
src/
├── api/
│   ├── clients/
│   ├── core/
│   ├── hooks.ts
│   ├── index.ts
│   └── projectApi.ts
├── components/
│   ├── feedback/
│   ├── layout/
│   └── ui/
├── data/
├── features/
│   └── infinite-canvas/
│       ├── api/
│       ├── components/
│       ├── config/
│       ├── hooks/
│       ├── stores/
│       ├── styles/
│       ├── types/
│       └── utils/
├── hooks/
├── lib/
├── pages/
│   ├── auth/
│   └── project/
├── stores/
├── types/
└── utils/
```

几个容易混淆的点：

- `src/pages/ProjectDetail.tsx` 仍然存在，但当前主项目工作台入口是 `src/pages/project/index.tsx`
- `src/api/projectApi.ts` 目前是 mock API，不是真实后端接口层
- `src/features/infinite-canvas/` 是一个相对独立的子系统，不要把它和主工作台状态混为一层

## 请求层架构

项目现在已经有一套轻量请求层，不要再在业务代码里重复 `axios.create()`。

### 设计目标

- 统一 `baseURL`、鉴权 header、错误标准化、运行时配置读取
- 保持架构简单，先做客户端分层
- 允许渐进迁移：普通 HTTP 请求优先 axios，流式请求可继续使用 `fetch`

### 目录职责

- `src/api/core/createHttpClient.ts`
  - axios 实例工厂
  - 统一 request/response interceptor
  - 把 axios 异常标准化为 `HttpError`
- `src/api/core/error.ts`
  - 定义 `HttpError`
  - 提供错误提取和归一化方法
- `src/api/core/runtime.ts`
  - 统一读取运行时配置
  - 例如环境变量中的业务 `baseURL`，以及 `localStorage` 中的 `apiKey`、`dashscopeApiKey`
- `src/api/core/fetch.ts`
  - 给 `fetch` 场景复用的响应校验能力
  - 主要给流式接口和非 axios 场景用
- `src/api/clients/appClient.ts`
  - 项目默认业务客户端
  - 默认 `baseURL` 由 `VITE_APP_API_BASE_URL` 控制
  - 未配置时回退到内置默认值
  - 会自动读取 `apiKey`
- `src/api/clients/dashscopeClient.ts`
  - DashScope 专用客户端
  - 负责 DashScope 的鉴权和错误文案映射
- `src/api/index.ts`
  - API 统一出口
  - 新代码优先从这里 import

### 现有使用方式

环境配置：

```bash
VITE_APP_API_BASE_URL=http://124.156.186.82:8080/api/v1
```

已提供：

- `.env.development`
- `.env.production`
- `.env.example`

普通 axios 客户端：

```ts
import { appClient } from "@/api"

const response = await appClient.get<MyResponse>("/projects")
const data = response.data
```

显式取 `response.data` 的辅助函数：

```ts
import { appClient, createRequest } from "@/api"

const data = await createRequest<MyResponse>(appClient, {
  url: "/projects",
  method: "GET",
})
```

流式或 fetch 场景：

```ts
import { getResponseReader, parseJsonResponse } from "@/api"
```

当前接入状态：

- `src/features/infinite-canvas/utils/request.ts`
  - 已复用 `appClient`
- `src/features/infinite-canvas/api/image.ts`
  - 已复用 `dashscopeClient`
- `src/features/infinite-canvas/api/video.ts`
  - 已复用 `dashscopeClient`
- `src/features/infinite-canvas/api/chat.ts`
  - 因为涉及流式输出，仍然使用 `fetch`
  - 但已复用 `src/api/core/fetch.ts`

### 约定

- 新增普通 HTTP 接口时：
  - 优先复用 `appClient` 或已有专用 client
  - 不要在业务文件里再次 `axios.create()`
- 新增第三方服务时：
  - 在 `src/api/clients/` 下新增独立 client
  - 把该服务自己的鉴权、超时、错误映射放在对应 client 内
- 新增流式接口时：
  - 可以继续使用 `fetch`
  - 但优先复用 `src/api/core/fetch.ts`
- UI 提示不要写进 `core`
  - `core` 只做底层能力
  - `message.error` 这类逻辑放在具体 client 中注入

### 给下一个 AI 的建议

- 新增业务接口，优先补在 `src/api/` 下，而不是直接写在页面组件里
- 主业务接口优先复用 `appClient`
- 特殊服务商接口新增 `src/api/clients/xxxClient.ts`
- 如果要继续整理，可以新增：
  - `src/api/services/xxx.ts`
  - `src/api/types.ts`

## UI 与反馈约定

- 统一反馈优先使用 `useFeedback()`
- 不要直接用浏览器原生 `alert` / `confirm`
- 悬浮菜单、用户菜单、抽屉、对话框优先复用已有基础组件
- 身份切换、项目权限、通知抽屉等交互已经有现成实现，改动前先搜现有组件

## 主题说明

当前视觉基调以暖橙、米白浅色系为主，核心样式变量定义在 `src/index.css`。

常用类：

```tsx
signature-gradient
bg-[hsl(var(--primary))]
bg-[hsl(var(--surface-container-low))]
```

## 构建与环境

- Node.js 18+
- npm 9+

生产构建：

```bash
npm run build
```

说明：

- 当前构建通常可以通过
- 但 Vite 仍会提示 chunk 体积较大，这是已知现状，不是请求层问题

## 参考文档

- 后端接口设计见 [BACKEND_API_SPEC.md](./BACKEND_API_SPEC.md)
