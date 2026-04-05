import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus, 
  MoreVertical,
  History,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
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
    action: "上传了 12 个新资源到",
    target: "Cyberpunk Ronin",
    time: "12:45"
  },
  {
    id: 2,
    type: "review",
    text: "编辑审核",
    action: "完成了第 04 章的审核",
    target: "Spirit of Zen",
    time: "昨天"
  }
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState(initialProjects)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)

  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`)
  }

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
            title="控制台"
            subtitle="欢迎回到你的动态工作区。"
            searchPlaceholder="搜索项目..."
            actions={
              <Button
                onClick={() => setIsProjectDialogOpen(true)}
                className="signature-gradient rounded-xl border-0 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90"
              >
                <Plus className="mr-2 h-4 w-4" />
                新建项目
              </Button>
            }
          />
        }
      >
        <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="border-0 bg-[hsl(var(--surface-container-lowest))] p-5 shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[hsl(var(--secondary))]">项目总览</p>
            <p className="mt-3 text-3xl font-black text-[hsl(var(--on-surface))]">{projects.length}</p>
            <p className="mt-1 text-sm text-[hsl(var(--secondary))]">当前工作区项目总数</p>
          </Card>
          <Card className="border-0 bg-[hsl(var(--surface-container-lowest))] p-5 shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[hsl(var(--secondary))]">进行中</p>
            <p className="mt-3 text-3xl font-black text-[hsl(var(--on-surface))]">
              {projects.filter((project) => project.status === "in-progress").length}
            </p>
            <p className="mt-1 text-sm text-[hsl(var(--secondary))]">正在推进的创作项目</p>
          </Card>
          <Card className="border-0 bg-[hsl(var(--surface-container-lowest))] p-5 shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[hsl(var(--secondary))]">最近更新</p>
            <p className="mt-3 text-lg font-black text-[hsl(var(--on-surface))]">{projects[0]?.name ?? "暂无项目"}</p>
            <p className="mt-1 text-sm text-[hsl(var(--secondary))]">刚刚更新于工作区</p>
          </Card>
        </section>

        {/* Recent Projects Section */}
        <div className="flex items-end justify-between mb-8">
          <h3 className="text-xl font-bold tracking-tight text-[hsl(var(--on-surface))] flex items-center gap-2">
            最近项目
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]"></span>
          </h3>
          <Button variant="link" className="text-[hsl(var(--primary))] font-bold text-xs uppercase tracking-widest hover:underline p-0">
            查看全部
          </Button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card 
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="group bg-[hsl(var(--surface-container-lowest))] rounded-xl p-4 transition-all duration-300 hover:bg-[hsl(var(--surface-container-highest))] hover:scale-[1.02] border-0 shadow-none cursor-pointer"
            >
              <div className="aspect-[16/10] rounded-lg overflow-hidden mb-5 bg-[hsl(var(--surface-container))] relative">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                  <Badge 
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border-0 ${
                      project.status === "in-progress" 
                        ? "bg-[hsl(var(--primary))] text-white" 
                        : "bg-[hsl(var(--secondary))] text-white"
                    }`}
                  >
                    {project.status === "in-progress" ? "进行中" : "已完成"}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-[hsl(var(--on-surface))] leading-tight mb-1">{project.name}</h4>
                  <p className="text-xs text-[hsl(var(--secondary))] font-medium">更新于 {project.updated}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-[hsl(var(--on-surface-variant))] hover:text-[hsl(var(--primary))] transition-colors h-8 w-8">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
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
                  <span className="font-bold text-[hsl(var(--primary))]">{activity.target}</span>
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
      </WorkspaceLayout>
    </>
  )
}
