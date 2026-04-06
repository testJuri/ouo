# MangaCanvas 待办清单

> 当前策略：**纯前端 Mock 闭环**，暂不接入真实 API。
> 
> **状态说明**: 后端开发中，所有数据操作均为本地模拟（localStorage + Zustand Store），接口已预留但暂未对接真实服务。
> 
> **后端开发请参考**: [`BACKEND_API_SPEC.md`](./BACKEND_API_SPEC.md)

---

## ✅ 已完成

### 架构优化 ✅
- [x] **项目资产状态重构** (2025-04-05)
  - 新增 `src/stores/projectStore.ts` - 集中管理项目资产状态
  - 新增 `src/types/index.ts` - 统一类型定义
  - 新增 `src/data/initialData.ts` - 分离 Mock 数据
  - `ProjectDetail` 代码行数 -70%，从 374 行减至 112 行
  - 各 Tab 组件直接订阅 Store，移除 props 传递

- [x] 画廊页面（`/gallery`）与导航
- [x] Dashboard 新建项目弹框（含表单验证与列表实时更新）
- [x] 片段弹框 `EpisodeCreator.tsx` 提交逻辑（支持新建片段并实时显示）
- [x] **项目列表页** (`/projects`) - 卡片网格展示，支持新建项目

### P0 核心流程闭环 ✅
- [x] **场景管理**
  - `ScenesTab` state 化（支持外部控制或内部状态）
  - `SceneCreator` 添加 `onCreate` 回调，支持表单提交
  - 参考图本地上传预览（`URL.createObjectURL`）
  - 卡片操作菜单：删除、复制
  
- [x] **角色管理**
  - `CharactersTab` state 化，优化为 5-7 列紧凑布局
  - `CharacterCreator` 添加 `onCreate` 回调
  - 角色定位选择（主角/配角）
  - 参考图本地上传预览
  - 提示词模板一键填入
  - 种子复制功能
  - 卡片操作菜单：编辑、删除、复制
  
- [x] **物品管理**
  - 创建 `ObjectsTab.tsx` 完整组件，优化为 6-10 列布局
  - 创建 `ObjectCreator.tsx` 抽屉组件（名称+生成方式+上传）
  - 参考图本地上传（单张+批量）
  - 物品生成任务列表抽屉
  - 卡片操作菜单：删除、复制

- [x] **片段管理**
  - 片段卡片添加场景效果图（Unsplash 高质量图片）
  - 创建片段弹框：片段文件夹名称、片段数量、片段说明
  - 剧本模式支持文件上传（TXT 格式，4MB 限制）
  - 表单校验（必填字段验证）
  - **片段详情页** (`/project/:id/episode/:episodeId`)
    - 片段概览：名称、状态、进度、描述
    - 登场角色列表（可添加/查看）
    - 使用场景展示（缩略图+镜头数）
    - 道具物品网格
    - 分镜时间线（可点击编辑）
    - 制作进度统计
    - **标记完成功能**（联动列表页状态显示）

### UI/UX 优化 ✅
- [x] **顶部导航** - 个人中心下拉菜单（身份切换、我的主页、退出登录）
- [x] **通知中心** - 右侧滑出侧边栏，展示消息列表，支持全部已读
- [x] **项目切换** - 2秒 loading 动画后跳转工作台
- [x] **密码输入** - 禁止输入中文字符
- [x] **表单校验** - 所有 Creator 组件添加非空校验
- [x] **浏览器标题** - 改为 "MangaCanvas - AI 漫画创作平台"
- [x] **Footer** - 项目工作台和项目列表页补全 footer

### 公共页面 ✅
- [x] **服务条款页面** (`/terms`)
- [x] **隐私政策页面** (`/privacy`)
- [x] **联系我们页面** (`/contact`)
- [x] **工作流页面** (`/workflow`)

---

## 🔴 P0 — 核心创作流程闭环（剩余）

### 1. 卡片编辑功能
- [ ] 场景卡片 - `编辑` 按钮打开 `SceneCreator` 回显数据
- [ ] 角色卡片 - `编辑` 按钮打开 `CharacterCreator` 回显数据
- [ ] 物品卡片 - `编辑` 按钮打开 `ObjectCreator` 回显数据
- [ ] 片段卡片 - `⋯` 更多按钮 DropdownMenu：删除、复制

---

## 🟠 P1 — Dashboard 与导航闭环

### 2. Dashboard 功能补全
- [ ] 项目卡片更多操作（DropdownMenu：重命名、删除、复制）
- [ ] 侧边栏导航高亮（仪表盘/项目当前页高亮）
- [ ] 侧边栏其他页面壳（资源 / 团队 / 设置 / 分析）

### 3. 批量操作
- [ ] 批量删除 - 点击进入选择模式，卡片显示复选框，确认删除

### 4. `antd` 渐进替代方案

> 目标：保持无限画布功能可用，逐步收敛到 `shadcn/ui + Radix + Tailwind`，避免一次性重写引入大回归。

#### Phase 1 - 先清理全局副作用与反馈层
- [ ] 移除 `src/pages/project/WorkflowCanvas.tsx` 中的 `antd/dist/reset.css`
- [ ] 为无限画布接入项目统一反馈层，替代 `antd message`
- [ ] 将 `Canvas.tsx` 中的 `Modal.confirm` 替换为项目内确认弹层
- [ ] 将 `Canvas.tsx` / 节点工具栏中的 `Tooltip` 替换为项目内 tooltip / title 方案
- [ ] 约束原则：先替代全局弹层和 portal，优先消除遮挡、点击失效、body scroll lock 一类问题

#### Phase 2 - 替换画布外层弹窗与面板
- [ ] 替换 `src/features/infinite-canvas/components/ApiSettings.tsx` 的 `antd Modal/Form/Input/Button`
- [ ] 替换 `src/features/infinite-canvas/components/DownloadModal.tsx`
- [ ] 替换 `src/features/infinite-canvas/components/PreviewModal.tsx`
- [ ] 替换 `src/features/infinite-canvas/components/SaveToMaterialsModal.tsx`
- [ ] 收敛画布页顶部与侧边面板的图标来源，优先改用 `lucide-react`

#### Phase 3 - 替换节点内部表单控件
- [ ] 替换 `nodes/TextNode.tsx` 的 `Input/Button/Tooltip`
- [ ] 替换 `nodes/ImageNode.tsx` 的 `Input/Upload/Spin/Tooltip`
- [ ] 替换 `nodes/ImageConfigNode.tsx` 的 `Input/Select/Button`
- [ ] 替换 `nodes/VideoConfigNode.tsx` 的 `Input/Select/Button`
- [ ] 替换 `nodes/EffectConfigNode.tsx` 的 `Input/Select`
- [ ] 替换 `nodes/TemplateEffectNode.tsx` 的 `Input/Select/Button`
- [ ] 替换 `nodes/VideoNode.tsx` 的 `Input`

#### Phase 4 - 收尾与依赖下线
- [ ] 全仓搜索确认无 `from "antd"` / `from 'antd'`
- [ ] 全仓搜索确认无 `@ant-design/icons`
- [ ] 删除 `package.json` 中 `antd` 与 `@ant-design/icons`
- [ ] 跑通 `npm run build` 与关键交互回归
- [ ] 补一份迁移记录：哪些交互用 shadcn，哪些保留为自定义画布原生 UI

#### 迁移原则
- [ ] 不在同一轮同时重写节点逻辑与视觉样式
- [ ] 每次只替换一类 primitive，先保证行为一致，再做视觉统一
- [ ] 优先替换会创建 portal / overlay / body 锁定的组件
- [ ] 新增交互一律不再引入 `antd`

---

## 🟡 P2 — 认证与首页交互

### 4. 认证系统
- [x] 登录/注册表单提交，localStorage 存储用户
- [x] 登录页自动填充 Mock 数据
- [x] 移除第三方登录（Google/GitHub）
- [ ] Header 根据 localStorage 显示用户头像

### 5. 首页交互
- [ ] 场景编排卡片点击跳转 `/dashboard`

---

## 🟢 P3 — 项目详情页的辅助功能

### 6. 顶部操作按钮
- [ ] 导出视频 - Mock 提示
- [ ] 分享 - 复制当前 URL

---

## 🔵 P4 — 高级功能（规划中）

### 7. 图片改创 (`remix` tab)
- [ ] 创建 `RemixTab.tsx`（原图上传+风格选择+生成结果）
- [ ] Mock 生成流程

### 8. Pricing CTA 闭环
- [ ] 立即升级 → 支付模拟 Dialog
- [ ] 联系销售 → 跳转 `/contact`

---

## 🟣 P5 — 体验优化与 Polish

### 9. 动画与过渡
- [ ] 卡片进入动画（stagger 效果）
- [ ] 页面切换过渡效果

### 10. 空状态设计
- [ ] 各标签页空状态插图和文案

### 11. 响应式优化
- [ ] 移动端侧边栏折叠
- [ ] 抽屉移动端全屏

---

## ⚪ P6 — 后端接入（等待后端开发完成）

> **当前状态**: 后端开发中，前端已完成接口预留和 Mock 实现

- [ ] 替换 Mock 数据为真实 API (`src/api/*` 已预留接口)
- [ ] 接入 React Query / TanStack Query
- [ ] 用户认证 JWT 全局管理
- [ ] 真实 AI 生成服务对接
- [ ] 文件上传接口（OSS / S3 直传）

### 已预留但未对接的 API 模块
| 模块 | 文件 | 说明 |
|------|------|------|
| 项目 API | `src/api/projectApi.ts` | 增删改查接口已定义，使用 mockPromise 模拟 |
| 用户 API | `src/api/hooks.ts` | useUser/useProjects hooks 已预留，返回假数据 |
| 场景/角色/物品 | `src/stores/projectStore.ts` | createScene/createCharacter/createObject 待接入真实 POST 请求 |

---

## 📊 任务统计

| 优先级 | 任务数 | 完成数 | 进度 |
|--------|--------|--------|------|
| ✅ P0 - 架构与核心 | 5 | 5 | 100% |
| 🔴 P0 - 核心流程 | 28 | 22 | 78.6% |
| 🟠 P1 - Dashboard | 6 | 1 | 16.7% |
| 🟡 P2 - 认证与首页 | 5 | 3 | 60% |
| 🟢 P3 - 辅助功能 | 4 | 0 | 0% |
| 🔵 P4 - 高级功能 | 5 | 0 | 0% |
| 🟣 P5 - 体验优化 | 6 | 0 | 0% |
| ⚪ P6 - 后端接入 | 5 | 0 | 0% |
| **总计** | **64** | **31** | **48.4%** |

---

*最后更新：2026-04-05*

---

## 📝 更新日志

### 2026-04-05
- ✅ 补充无限画布 `antd` 渐进替代方案（分阶段迁移计划）
- ✅ 片段详情页添加「标记完成」功能
- ✅ 创建项目列表页 (`/projects`)
- ✅ 新建项目支持剧本模式文件上传
- ✅ 密码输入过滤中文字符
- ✅ 项目切换添加 2 秒 loading 动画
- ✅ 顶部导航添加通知中心侧边栏
- ✅ 优化角色卡片布局（5-7 列）
- ✅ 优化物品卡片布局（6-10 列）
- ✅ 片段卡片添加场景效果图
- ✅ 移除第三方登录选项
- ✅ 个人中心下拉菜单优化
- ✅ 所有 Creator 组件添加表单校验
- ✅ 修改浏览器标题为 MangaCanvas
- ✅ 项目切换后自动跳转工作台
- ✅ 项目工作台和列表页补全 footer
