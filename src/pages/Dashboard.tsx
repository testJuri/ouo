import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus, 
  History,
  FolderOpen,
  Sparkles,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import ProjectCreator from "./ProjectCreator"
import WorkspaceHeader from "@/components/layout/WorkspaceHeader"
import WorkspaceLayout from "@/components/layout/WorkspaceLayout"

const initialProjects = [
  {
    id: 1,
    name: "Cyberpunk Ronin",
    image: "https://images.unsplash.com/photo-1614726365723-49cfae927846?w=600&h=400&fit=crop",
    status: "in-progress",
    updated: "2 小时前"
  },
  {
    id: 2,
    name: "Spirit of Zen",
    image: "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=600&h=400&fit=crop",
    status: "completed",
    updated: "3 天前"
  },
  {
    id: 3,
    name: "Mech Core Series",
    image: "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=600&h=400&fit=crop",
    status: "in-progress",
    updated: "5 小时前"
  },
  {
    id: 4,
    name: "Kinetic Backgrounds",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=400&fit=crop",
    status: "in-progress",
    updated: "1 周前"
  }
]

const activities = [
  {
    id: 1,
    type: "upload",
    users: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    ],
    text: "Elena 和 Marcus",
    action: "上传了 12 个新场景",
    time: "12:45"
  },
  {
    id: 2,
    type: "review",
    text: "编辑审核",
    action: "完成了第 04 章的审核",
    time: "昨天"
  },
  {
    id: 3,
    type: "upload",
    users: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"],
    text: "陈晓明",
    action: "创建了新角色",
    time: "2 小时前"
  }
]

// 空状态组件
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 rounded-full bg-[hsl(var(--surface-container-high))] flex items-center justify-center mb-6">
        <FolderOpen className="w-12 h-12 text-[hsl(var(--secondary))]" />
      </div>
      <h2 className="text-2xl font-black text-[hsl(var(--on-surface))] mb-3">
        还没有项目
      </h2>
      <p className="text-[hsl(var(--secondary))] max-w-md mb-8">
        创建你的第一个项目，开始漫画创作之旅。你可以管理片段、场景、角色和工作流。
      </p>
      <Button
        onClick={onCreate}
        className="signature-gradient rounded-xl border-0 px-8 py-4 text-base font-bold text-white shadow-lg hover:opacity-90 hover:scale-105 transition-all"
      >
        <Plus className="mr-2 h-5 w-5" />
        创建第一个项目
      </Button>
      
      <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-[hsl(var(--primary))]" />
          </div>
          <p className="text-xs font-bold text-[hsl(var(--on-surface))]">AI 辅助创作</p>
          <p className="text-[10px] text-[hsl(var(--secondary))] mt-1">智能生成场景和角色</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center mx-auto mb-3">
            <FolderOpen className="w-6 h-6 text-[hsl(var(--primary))]" />
          </div>
          <p className="text-xs font-bold text-[hsl(var(--on-surface))]">资产管理</p>
          <p className="text-[10px] text-[hsl(var(--secondary))] mt-1">统一管理所有资源</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center mx-auto mb-3">
            <History className="w-6 h-6 text-[hsl(var(--primary))]" />
          </div>
          <p className="text-xs font-bold text-[hsl(var(--on-surface))]">工作流编排</p>
          <p className="text-[10px] text-[hsl(var(--secondary))] mt-1">可视化编辑流程</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { id: projectId } = useParams<{ id: string }>()
  const [projects, setProjects] = useState(initialProjects)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)

  // 获取当前项目
  const currentProject = projects.find(p => p.id === Number(projectId)) || projects[0]
  
  // 是否有项目
  const hasProjects = projects.length > 0

  const handleCreateProject = (data: {
    name: string
    password?: string
    mode: string
    description: string
    scriptFile?: File | null
  }) => {
    const newProject = {
      id: Date.now(),
      name: data.name,
      image: `https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=400&fit=crop`,
      status: "in-progress" as const,
      updated: "刚刚",
    }
    setProjects((prev) => [newProject, ...prev])
  }

  return (
    <>
      <ProjectCreator
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onCreate={handleCreateProject}
      />
      <WorkspaceLayout
        header={
          <WorkspaceHeader
            title={hasProjects ? `${currentProject?.name || '项目'} 看板` : '欢迎'}
            subtitle={hasProjects ? "项目概览与活动动态" : "开始你的创作之旅"}
            searchPlaceholder="搜索..."
            actions={
              hasProjects ? (
                <Button
                  onClick={() => navigate(`/project/${currentProject?.id || projectId}`)}
                  className="signature-gradient rounded-xl border-0 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90"
                >
                  进入工作台
                </Button>
              ) : (
                <Button
                  onClick={() => setIsProjectDialogOpen(true)}
                  className="signature-gradient rounded-xl border-0 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  新建项目
                </Button>
              )
            }
          />
        }
      >
        {!hasProjects ? (
          <EmptyState onCreate={() => setIsProjectDialogOpen(true)} />
        ) : (
        <>
        <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <Card className="border-0 bg-[hsl(var(--surface-container-lowest))] p-5 shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[hsl(var(--secondary))]">片段</p>
            <p className="mt-3 text-3xl font-black text-[hsl(var(--on-surface))]">12</p>
            <p className="mt-1 text-sm text-[hsl(var(--secondary))]">项目中的片段总数</p>
          </Card>
          <Card className="border-0 bg-[hsl(var(--surface-container-lowest))] p-5 shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[hsl(var(--secondary))]">场景</p>
            <p className="mt-3 text-3xl font-black text-[hsl(var(--on-surface))]">48</p>
            <p className="mt-1 text-sm text-[hsl(var(--secondary))]">已创建的场景</p>
          </Card>
          <Card className="border-0 bg-[hsl(var(--surface-container-lowest))] p-5 shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[hsl(var(--secondary))]">角色</p>
            <p className="mt-3 text-3xl font-black text-[hsl(var(--on-surface))]">8</p>
            <p className="mt-1 text-sm text-[hsl(var(--secondary))]">项目角色数</p>
          </Card>
          <Card className="border-0 bg-[hsl(var(--surface-container-lowest))] p-5 shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[hsl(var(--secondary))]">物品</p>
            <p className="mt-3 text-3xl font-black text-[hsl(var(--on-surface))]">24</p>
            <p className="mt-1 text-sm text-[hsl(var(--secondary))]">道具和素材</p>
          </Card>
        </section>

        {/* Quick Access */}
        <div className="flex items-end justify-between mb-8">
          <h3 className="text-xl font-bold tracking-tight text-[hsl(var(--on-surface))] flex items-center gap-2">
            快速访问
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]"></span>
          </h3>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            onClick={() => navigate(`/project/${projectId}`)}
            className="group bg-[hsl(var(--surface-container-lowest))] rounded-xl p-5 transition-all duration-300 hover:bg-[hsl(var(--surface-container-highest))] border-0 shadow-none cursor-pointer"
          >
            <h4 className="text-lg font-bold text-[hsl(var(--on-surface))] mb-2">片段管理</h4>
            <p className="text-sm text-[hsl(var(--secondary))]">管理故事片段和章节</p>
          </Card>
          <Card 
            onClick={() => navigate(`/project/${projectId}`)}
            className="group bg-[hsl(var(--surface-container-lowest))] rounded-xl p-5 transition-all duration-300 hover:bg-[hsl(var(--surface-container-highest))] border-0 shadow-none cursor-pointer"
          >
            <h4 className="text-lg font-bold text-[hsl(var(--on-surface))] mb-2">场景管理</h4>
            <p className="text-sm text-[hsl(var(--secondary))]">管理场景和背景</p>
          </Card>
          <Card 
            onClick={() => navigate(`/project/${projectId}`)}
            className="group bg-[hsl(var(--surface-container-lowest))] rounded-xl p-5 transition-all duration-300 hover:bg-[hsl(var(--surface-container-highest))] border-0 shadow-none cursor-pointer"
          >
            <h4 className="text-lg font-bold text-[hsl(var(--on-surface))] mb-2">角色管理</h4>
            <p className="text-sm text-[hsl(var(--secondary))]">管理角色和人物</p>
          </Card>
          <Card 
            onClick={() => navigate(`/project/${projectId}`)}
            className="group bg-[hsl(var(--surface-container-lowest))] rounded-xl p-5 transition-all duration-300 hover:bg-[hsl(var(--surface-container-highest))] border-0 shadow-none cursor-pointer"
          >
            <h4 className="text-lg font-bold text-[hsl(var(--on-surface))] mb-2">工作流</h4>
            <p className="text-sm text-[hsl(var(--secondary))]">进入无限画布编排</p>
          </Card>
        </div>

        {/* Activity Feed */}
        <section className="mt-24 max-w-4xl">
          <h3 className="text-xl font-bold tracking-tight text-[hsl(var(--on-surface))] mb-8">活动动态</h3>
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-6 p-4 rounded-xl bg-[hsl(var(--surface-container-low))]/50">
                {activity.type === "upload" ? (
                  <div className="flex -space-x-3">
                    {activity.users?.map((user, idx) => (
                      <Avatar key={idx} className="w-8 h-8 border-2 border-[hsl(var(--surface))]">
                        <AvatarImage src={user} alt="用户" />
                        <AvatarFallback className="text-xs">U{idx + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))]">
                    <History className="w-4 h-4" />
                  </div>
                )}
                <div className="text-sm">
                  <span className="font-bold text-[hsl(var(--on-surface))]">{activity.text}</span>
                  <span className="text-[hsl(var(--secondary))]"> {activity.action} </span>
                </div>
                <div className="ml-auto text-[10px] text-[hsl(var(--secondary))] font-bold uppercase tracking-widest">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </section>
        <footer className="mt-24 border-t border-[hsl(var(--outline-variant))]/15 py-10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <span className="text-lg font-bold text-[hsl(var(--on-surface))]">MangaCanvas</span>
              <p className="mt-1 text-xs text-[hsl(var(--on-secondary-fixed-variant))]">© 2024 Kinetic Gallery. 保留所有权利。</p>
            </div>
            <div className="flex gap-8">
              <Link to="/privacy" className="text-xs text-[hsl(var(--secondary))] transition-opacity hover:text-[hsl(var(--primary))]">
                隐私政策
              </Link>
              <Link to="/terms" className="text-xs text-[hsl(var(--secondary))] transition-opacity hover:text-[hsl(var(--primary))]">
                服务条款
              </Link>
              <Link to="/contact" className="text-xs text-[hsl(var(--secondary))] transition-opacity hover:text-[hsl(var(--primary))]">
                联系我们
              </Link>
            </div>
          </div>
        </footer>
        </>
        )}
      </WorkspaceLayout>
    </>
  )
}
