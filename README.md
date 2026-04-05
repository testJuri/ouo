# MangaCanvas

基于 React + shadcn/ui 的漫画创作管理平台，提供场景管理、角色设计、资产组织、AI 生成等功能。

## 快速预览

```bash
npm install
npm run dev
```

打开浏览器访问 `http://localhost:5173` 即可预览。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件**: shadcn/ui + Tailwind CSS
- **路由**: React Router DOM
- **图标**: Lucide React
- **动画**: Framer Motion (预留)

## 路由结构

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 营销首页（Landing Page） |
| `/gallery` | Gallery | 创作者画廊（作品展示） |
| `/login` | Login | 登录/注册（支持邮箱、Google、GitHub） |
| `/pricing` | Pricing | 价格方案（免费/专业/企业） |
| `/dashboard` | Dashboard | 项目列表控制台 |
| `/project/:id` | ProjectDetail | 项目详情（6大功能标签） |
| `/project/:id/episode/:episodeId` | EpisodeDetail | 片段详情（创作入口） |

## 核心功能

### 1. 项目控制台
- **新建项目**: 弹框式创建，支持项目名称、访问密码、输入模式、项目说明、封面图上传
- **项目列表**: 卡片网格展示，点击进入项目详情
- **活动动态**: 展示团队最新操作记录

### 2. 项目工作台
- **项目切换器**: 侧边栏下拉菜单切换不同项目
- **6大功能标签**: 片段管理、角色管理、场景管理、物品管理、融合生图、图片改创
- **胶囊式导航**: 顶部圆角切换，选中态橙色渐变

### 3. 场景管理
- 场景卡片网格（4列响应式）
- 场景创建抽屉（双栏布局）
  - 左栏：场景名称、生成方式、参考图、镜头控制、风格模型、描述
  - 右栏：3D 预览、景别选择、距离滑块、生成任务队列
- 实时生成进度显示

### 4. 角色管理
- 角色卡片网格（5-6列紧凑布局）
- 角色创建抽屉：角色名称、性别、年龄段、生成方式、模型选择、描述、参考图上传
- 主角/配角标签区分
- 角色风格、场景数量展示

### 5. 片段管理
- 片段卡片网格
- 创建片段弹框：片段文件夹名称、片段数量、片段说明
- 支持创建后实时添加到列表
- 支持按状态筛选与展示
- **片段详情页** - 创作核心入口
  - 展示片段概览（名称、状态、进度、剧情简介）
  - 登场角色列表（支持添加/查看角色）
  - 使用场景展示（场景缩略图 + 镜头数）
  - 道具物品网格
  - 分镜时间线（可点击编辑单个镜头）
  - 制作进度统计（已完成/制作中/待开始）
  - 大大的「开始/继续创作」按钮

### 6. 创作者画廊
- 瀑布流式作品展示
- 分类筛选（全部 / 场景 / 角色 / 风格参考 / 概念稿）
- 搜索与点赞、浏览量展示

### 7. 认证系统
- 登录/注册切换
- 邮箱、Google、GitHub 登录支持
- Mock 登录：表单提交后存储到 localStorage，跳转到 Dashboard
- **开发便利**：登录页自动填充 Mock 数据（`demo@mangacanvas.com` / `123456`）

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── ui/             # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── sheet.tsx          # 抽屉组件
│   │   ├── slider.tsx         # 滑块
│   │   ├── textarea.tsx
│   │   ├── avatar.tsx
│   │   ├── dialog.tsx         # 弹框组件
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   └── dropdown-menu.tsx  # 下拉菜单
│   └── layout/         # 布局组件
│       ├── Sidebar.tsx          # 侧边导航栏（项目切换）
│       └── ProjectHeader.tsx    # 项目页面头部（胶囊导航）
├── pages/              # 页面组件
│   ├── auth/           # 认证相关
│   │   └── Login.tsx          # 登录/注册页
│   ├── project/        # 项目管理
│   │   ├── index.tsx          # 项目详情主页面
│   │   ├── SceneCreator.tsx   # 场景创建抽屉
│   │   ├── CharacterCreator.tsx # 角色创建抽屉
│   │   ├── EpisodeCreator.tsx   # 片段创建弹框
│   │   ├── EpisodeDetail.tsx    # 片段详情页（创作入口）
│   │   ├── ObjectCreator.tsx    # 物品创建抽屉
│   │   └── tabs/              # 项目子标签页
│   │       ├── EpisodesTab.tsx    # 片段管理
│   │       ├── ScenesTab.tsx      # 场景管理
│   │       ├── CharactersTab.tsx  # 角色管理
│   │       ├── ObjectsTab.tsx     # 物品管理
│   │       └── PlaceholderTab.tsx # 占位标签
│   ├── Dashboard.tsx   # 控制台（项目列表）
│   ├── ProjectCreator.tsx # 新建项目弹框
│   ├── Gallery.tsx     # 创作者画廊
│   ├── Pricing.tsx     # 价格方案页面
│   └── App.tsx         # 主应用（首页+路由）
├── lib/
│   └── utils.ts        # 工具函数（cn 等）
├── index.css           # 全局样式 + CSS 变量
├── tailwind.config.js  # Tailwind 配置
└── main.tsx           # 应用入口
```

## 文件分类规则

### 组件分类

| 目录 | 用途 | 示例 |
|------|------|------|
| `components/ui/` | shadcn/ui 基础组件 | Button, Card, Sheet, Dialog, Slider |
| `components/layout/` | 布局相关组件 | Sidebar, ProjectHeader |
| `pages/` | 页面级组件 | Dashboard, Gallery, Pricing, Login |
| `pages/project/tabs/` | 项目子标签页 | EpisodesTab, ScenesTab, CharactersTab |

### 命名规范

- **组件文件**: PascalCase，如 `SceneCreator.tsx`
- **工具文件**: camelCase，如 `utils.ts`
- **目录**: camelCase，如 `tabs/`, `auth/`

## 主题系统

### 主色调（暖橙色系）

```css
--primary: 14 100% 34%          /* 橙红色 #ac2e00 */
--primary-foreground: 0 0% 100% /* 白色 */
--surface: 30 20% 98%           /* 米白背景 */
--surface-container-low: 20 11% 96%
--surface-container-high: 0 5% 91%
```

### 常用样式类

```tsx
// 主按钮渐变
signature-gradient

// 主色背景
bg-[hsl(var(--primary))]

// 表面背景
bg-[hsl(var(--surface-container-low))]
```

## 响应式断点

```
sm: 640px   - 小屏手机
md: 768px   - 平板
lg: 1024px  - 桌面（侧边栏 256px 展开）
xl: 1280px  - 大屏
2xl: 1536px - 超大屏
```

## 数据结构

当前使用 Mock 数据，各页面通过 `useState` 管理本地状态，已实现基础的增删查改交互：

| 数据 | 位置 | 类型 | 说明 |
|------|------|------|------|
| 项目列表 | `Dashboard.tsx` | `projects[]` | 支持新建项目 |
| 场景数据 | `ScenesTab.tsx` | `scenes[]` | 静态展示 |
| 角色数据 | `CharactersTab.tsx` | `characters[]` | 静态展示 |
| 片段数据 | `EpisodesTab.tsx` | `episodes[]` | 支持新建片段，可进入详情页创作 |
| 生成任务 | `SceneCreator.tsx` | `generationTasks[]` | 模拟队列 |

### API 迁移建议

如需接入后端，建议：
1. 创建 `src/api/` 目录存放接口定义
2. 使用 React Query 管理服务端状态
3. 将 Mock 数据替换为 `fetch` 或 `axios` 调用

## 开发指南

### 添加新页面

1. 在 `pages/` 下创建组件文件
2. 在 `App.tsx` 中添加 `<Route />`
3. 如需导航链接，更新对应 Header 组件

### 添加项目标签页

1. 在 `pages/project/tabs/` 创建 `XxxTab.tsx`
2. 在 `pages/project/index.tsx` 的 `renderTabContent()` 添加 `case`
3. 在 `secondaryTabs` 数组中添加标签

### 使用弹框

```tsx
import { Dialog, DialogContent } from "@/components/ui/dialog"

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-[480px]">
    {/* 内容 */}
  </DialogContent>
</Dialog>
```

### 使用抽屉

```tsx
import { Sheet, SheetContent } from "@/components/ui/sheet"

<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right" className="w-[900px]">
    {/* 内容 */}
  </SheetContent>
</Sheet>
```

### 使用下拉菜单

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger>触发器</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>选项</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 构建部署

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建
npm run preview
```

## 环境要求

- Node.js 18+
- npm 9+

## 浏览器支持

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

## 后端接口设计

后端开发人员请参考 [`BACKEND_API_SPEC.md`](./BACKEND_API_SPEC.md)，文档包含完整的 API 接口设计、数据结构和实现建议。

## 待办清单

项目当前尚未闭环的功能清单请查看根目录下的 [`TODO.md`](./TODO.md)。

---

© 2024 MangaCanvas. All rights reserved.
