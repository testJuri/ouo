# MangaCanvas 待办清单

> 当前状态：**API 已大量对接**，剩余 35 个接口待接入。
> 
> **后端开发请参考**: [`BACKEND_API_SPEC_V2.md`](./BACKEND_API_SPEC_V2.md)

---

## 🔴 P0 — 核心阻塞（文件上传）

### 1. 文件上传模块 🚧
- [x] `POST /api/v1/upload/presigned` - 预签名上传 URL
- [x] `POST /api/v1/upload/confirm` - 上传完成确认
- [x] 创建 `uploadApi` 模块
- [x] 创建 `useUpload` / `useMultiUpload` Hooks
- [x] **Creator 组件对接真实上传** ✅
  - [x] `CharacterCreator` - 角色参考图上传
  - [x] `SceneCreator` - 场景参考图上传
  - [x] `ObjectCreator` - 物品参考图上传
  - [x] 替换 `URL.createObjectURL` 为真实上传流程

---

## 🔴 P0 — 核心流程

### 2. 片段卡片交互变更
- [ ] 点击片段卡片 → 展开抽屉（而非跳转页面）
- [ ] 抽屉内支持文生视频 / 图生视频操作
- [ ] 移除片段详情页独立路由（或保留为备用入口）

---

## 🟠 P1 — 重要功能（API 对接）

### 3. 组织管理模块
- [ ] `POST /api/v1/organizations` - 创建组织
- [ ] `GET /api/v1/organizations` - 组织列表
- [ ] `GET /api/v1/organizations/{id}` - 组织详情
- [ ] `POST /api/v1/organizations/{id}/members` - 添加成员
- [ ] `DELETE /api/v1/organizations/{id}/members/{userId}` - 移除成员
- [ ] `GET /api/v1/users/me/organizations` - 我的组织列表

### 4. 项目管理补充
- [ ] `POST /api/v1/projects/{id}/duplicate` - 复制项目
- [ ] 片段关联管理 `PATCH /episodes/{id}/relations`

### 5. 画布工作流补充
- [ ] `POST /api/v1/projects/{id}/canvas-workflows` - 创建工作流
- [ ] `PUT /api/v1/projects/{id}/canvas-workflows/{id}` - 保存工作流
- [ ] 工作流成员管理 CRUD

### 6. 项目资产补充
- [ ] `POST /api/v1/projects/{id}/assets` - 登记资产
- [ ] `PUT /api/v1/projects/{id}/assets/{id}` - 更新资产
- [ ] `DELETE /api/v1/projects/{id}/assets/{id}` - 删除资产

### 7. AI 模型网关 - 核心能力
- [ ] `POST /api/v1/ai/chat/completions` - 文本对话
- [ ] `POST /api/v1/ai/video/generations` - 视频生成（文生视频/图生视频）

### 8. 积分系统
- [ ] `GET /api/v1/credits` - 积分余额
- [ ] `GET /api/v1/credits/history` - 积分流水

---

## 🟠 P1 — Dashboard 与导航

### 9. Dashboard 功能补全
- [ ] 项目卡片更多操作（DropdownMenu：重命名、删除、复制）
- [ ] 侧边栏导航高亮（仪表盘/项目当前页高亮）
- [ ] 侧边栏其他页面壳（资源 / 团队 / 设置 / 分析）

### 10. 文档与工程收尾
- [ ] README 去重，避免与 `BACKEND_API_SPEC.md` 重复
- [x] 补全请求层使用文档（上传 API、useUpload Hook）✅
- [ ] 补一份"前端页面真实入口图"，明确 `src/pages/project/index.tsx` 才是当前项目工作台主入口
- [ ] 梳理并标记历史遗留页面/文件（如 `src/pages/ProjectDetail.tsx`）
- [ ] 给请求层补一个最小业务示例（推荐 `src/api/services/project.ts`）

---

## 🟡 P2 — 辅助功能（API 对接）

### 11. 认证补充
- [ ] `POST /api/v1/auth/oauth/{provider}` - OAuth 登录
- [ ] `GET /api/v1/health` - 健康检查

### 12. AI 模型网关 - 扩展能力
- [ ] `POST /api/v1/ai/audio/speech` - 语音合成（TTS）
- [ ] `POST /api/v1/ai/embeddings` - 文本向量化
- [ ] `GET /api/v1/ai/models` - 模型列表
- [ ] `GET /api/v1/ai/balance` - 余额查询
- [ ] `GET /api/v1/ai/bills` - 账单记录

### 13. 计费额度
- [ ] `GET /api/v1/billing/enterprise/quota` - 企业额度
- [ ] `GET /api/v1/billing/organizations/{id}/quota` - 组织额度
- [ ] `GET /api/v1/billing/projects/{id}/quota` - 项目额度
- [ ] `GET /api/v1/billing/projects/{id}/users/{userId}/quota` - 用户项目额度

---

## 🟡 P2 — 认证与首页

### 14. 认证系统
- [ ] Header 根据登录状态显示用户头像

### 15. 首页交互
- [ ] 场景编排卡片点击跳转 `/dashboard`

---

## 🟢 P3 — 辅助功能

### 16. 顶部操作按钮
- [ ] 导出视频 - Mock 提示
- [ ] 分享 - 复制当前 URL

---

## 🔵 P4 — 高级功能

### 17. 图片改创 (`remix` tab)
- [ ] 创建 `RemixTab.tsx`（原图上传+风格选择+生成结果）
- [ ] Mock 生成流程

### 18. Pricing CTA 闭环
- [ ] 立即升级 → 支付模拟 Dialog
- [ ] 联系销售 → 跳转 `/contact`

---

## 🟣 P5 — 体验优化

### 19. 动画与过渡
- [ ] 卡片进入动画（stagger 效果）
- [ ] 页面切换过渡效果

### 20. 空状态设计
- [ ] 各标签页空状态插图和文案

### 21. 响应式优化
- [ ] 移动端侧边栏折叠
- [ ] 抽屉移动端全屏

---

## 🐜 antd 渐进替代方案

> 目标：逐步收敛到 `shadcn/ui + Radix + Tailwind`

### Phase 1 - 先清理全局副作用与反馈层
- [ ] 移除 `src/pages/project/WorkflowCanvas.tsx` 中的 `antd/dist/reset.css`
- [ ] 为无限画布接入项目统一反馈层，替代 `antd message`
- [ ] 将 `Canvas.tsx` 中的 `Modal.confirm` 替换为项目内确认弹层
- [ ] 将 `Canvas.tsx` / 节点工具栏中的 `Tooltip` 替换为项目内 tooltip / title 方案

### Phase 2 - 替换画布外层弹窗与面板
- [ ] 替换 `src/features/infinite-canvas/components/ApiSettings.tsx`
- [ ] 替换 `src/features/infinite-canvas/components/DownloadModal.tsx`
- [ ] 替换 `src/features/infinite-canvas/components/PreviewModal.tsx`
- [ ] 替换 `src/features/infinite-canvas/components/SaveToMaterialsModal.tsx`
- [ ] 收敛画布页顶部与侧边面板的图标来源，优先改用 `lucide-react`

### Phase 3 - 替换节点内部表单控件
- [ ] 替换 `nodes/TextNode.tsx`
- [ ] 替换 `nodes/ImageNode.tsx`
- [ ] 替换 `nodes/ImageConfigNode.tsx`
- [ ] 替换 `nodes/VideoConfigNode.tsx`
- [ ] 替换 `nodes/EffectConfigNode.tsx`
- [ ] 替换 `nodes/TemplateEffectNode.tsx`
- [ ] 替换 `nodes/VideoNode.tsx`

### Phase 4 - 收尾与依赖下线
- [ ] 全仓搜索确认无 `from "antd"` / `from 'antd'`
- [ ] 全仓搜索确认无 `@ant-design/icons`
- [ ] 删除 `package.json` 中 `antd` 与 `@ant-design/icons`
- [ ] 跑通 `npm run build` 与关键交互回归

---

## 📊 任务统计

| 优先级 | 任务数 | 完成数 | 进度 |
|--------|--------|--------|------|
| 🔴 P0 - 核心阻塞 | 5 | 0 | 0% |
| 🟠 P1 - 重要功能 | 22 | 0 | 0% |
| 🟡 P2 - 辅助功能 | 16 | 0 | 0% |
| 🟢 P3 - 辅助功能 | 2 | 0 | 0% |
| 🔵 P4 - 高级功能 | 4 | 0 | 0% |
| 🟣 P5 - 体验优化 | 5 | 0 | 0% |
| 🐜 antd 替代 | 15 | 0 | 0% |
| **总计** | **69** | **0** | **进行中** |

### API 对接统计

| 模块 | 已对接 | 未对接 | 总计 |
|------|--------|--------|------|
| Auth | 4 | 1 (OAuth) | 5 |
| Organizations | 0 | 6 | 6 |
| Projects | 6 | 2 | 8 |
| Project Members | 4 | 0 | 4 |
| Characters | 5 | 0 | 5 |
| Scenes | 5 | 0 | 5 |
| Objects | 5 | 0 | 5 |
| Episodes | 5 | 1 | 6 |
| Workflows | 3 | 3 | 6 |
| Assets | 1 | 2 | 3 |
| Upload | 4 | 0 | 4 |
| AI Gateway | 1 | 7 | 8 |
| Credits/Billing | 0 | 6 | 6 |
| **总计** | **43** | **26** | **69** |

---

*最后更新：2026-04-10*

## 📝 更新日志

### 2026-04-10
- 🔄 更新策略说明：API 已大量对接，不再是纯前端 Mock
- 📝 重新梳理 API 对接情况，列出剩余 30 个待对接接口
- ✅ 清理已完成的历史任务
- 📝 重新整理待办清单，按优先级分类

### 2026-04-12
- 📝 追加 OUO API 封装接口待真实测试清单

---

## 🔶 OUO API 封装接口（待后端真实测试）

> 以下接口已在 `src/api/ouoApi.ts` 中完成封装，前端通过 MSW 模拟验证通过，但尚未与后端真实接口联调，需等待后端就绪后逐一测试。

| # | 函数名 | 方法 | 路径 | 文档序号 | 测试状态 |
|---|--------|------|------|----------|----------|
| 1 | `uploadFile(file, group)` | POST | `/common/upload` | 1 | ⬜ 待测试 |
| 2 | `createTask(params)` | POST | `/task/create` | 2 | ⬜ 待测试 |
| 3 | `getMyTasks(page, pageSize)` | GET | `/task/my-tasks` | 3 | ⬜ 待测试 |
| 4 | `getTaskStatus(taskId)` | GET | `/task/status` | 4 | ⬜ 待测试 |
| 5 | `getTaskDetail(taskId)` | GET | `/task/detail` | 5 | ⬜ 待测试 |
| 6 | `getTaskEpisodes(taskId)` | GET | `/task/episodes` | 6 | ⬜ 待测试 |
| 7 | `getEpisodeDetail(episodeId)` | GET | `/episode/detail` | 7 | ⬜ 待测试 |
| 8 | `getEpisodeMonitor(episodeId)` | GET | `/episode/monitor` | 8, 10, 12, 15, 18, 21, 29, 31 | ⬜ 待测试 |
| 9 | `autoProcessEpisode(episodeId)` | POST | `/task/episode/autoProcess` | 9 | ⬜ 待测试 |
| 10 | `generateCharacterPic(characterId)` | POST | `/character/pic/generate` | 11 | ⬜ 待测试 |
| 11 | `getAccountInfo()` | GET | `/account/info` | 13, 16, 19, 26 | ⬜ 待测试 |
| 12 | `generateScenePic(sceneId, prompt?, refs?)` | POST | `/scene/pic/generate` | 14, 34 | ⬜ 待测试 |
| 13 | `regenerateProp(propId)` | POST | `/prop/regenerate` | 17 | ⬜ 待测试 |
| 14 | `splitEpisodeShots(episodeId)` | POST | `/episode/shot/split` | 20 | ⬜ 待测试 |
| 15 | `getEpisodeShots(episodeId)` | GET | `/task/episode/shots` | 22, 25, 32 | ⬜ 待测试 |
| 16 | `regenerateShot(shotId)` | POST | `/shot/regenerate` | 23 | ⬜ 待测试 |
| 17 | `batchGenerateShots(episodeId)` | POST | `/shot/generate/batch` | 24 | ⬜ 待测试 |
| 18 | `mergeEpisodeVideo(episodeId)` | POST | `/episode/video/merge` | 27 | ⬜ 待测试 |
| 19 | `getVideoMergeHistory(episodeId)` | GET | `/history/video-merge/list` | 30 | ⬜ 待测试 |
| 20 | `createCharacter(episodeId, name, prompt)` | POST | `/character/create` | 30（添加角色） | ⬜ 待测试 |
| 21 | `createScene(episodeId, location, prompt)` | POST | `/scene/create` | 31（添加场景） | ⬜ 待测试 |
| 22 | `createProp(episodeId, name, prompt)` | POST | `/prop/create` | 32（添加道具） | ⬜ 待测试 |
| 23 | `addShot(shotId, addLocation)` | POST | `/shot/add` | 37 | ⬜ 待测试 |
