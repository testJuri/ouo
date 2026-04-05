import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LayoutGrid, 
  FolderOpen, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  MoreVertical,
  PlusCircle,
  History,
  ArrowLeft
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import ProjectCreator from "./ProjectCreator"

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

const navItems = [
  { icon: LayoutGrid, label: "项目", href: "#", active: true },
  { icon: FolderOpen, label: "资源", href: "#" },
  { icon: Users, label: "团队", href: "#" },
  { icon: Settings, label: "设置", href: "#" },
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
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      <ProjectCreator
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onCreate={handleCreateProject}
      />
      {/* Side Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[hsl(var(--surface-container-low))] flex flex-col p-6 gap-y-4 z-40">
        {/* Logo & Project Info */}
        <div className="mb-8 px-2">
          <Link to="/" className="text-xl font-bold text-[hsl(var(--primary))] hover:opacity-80 transition-opacity">
            MangaCanvas
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--surface-container-highest))] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
                alt="用户头像" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[hsl(var(--primary))]">Project Alpha</p>
              <p className="text-[10px] text-[hsl(var(--secondary))] font-medium uppercase tracking-wider">编辑阶段</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active 
                  ? "bg-[hsl(var(--surface-container-high))] text-[hsl(var(--primary))] translate-x-1" 
                  : "text-[hsl(var(--on-secondary-fixed-variant))] hover:bg-[hsl(var(--surface-container-high))]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-widest">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Back to Home */}
        <div className="mt-4">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-2 text-[hsl(var(--on-secondary-fixed-variant))]">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">返回首页</span>
            </Button>
          </Link>
        </div>

        {/* New Asset Button */}
        <div className="mt-auto">
          <Button className="w-full py-6 signature-gradient text-white rounded-xl font-bold text-sm tracking-widest uppercase shadow-lg hover:scale-[1.02] transition-transform active:scale-95 border-0">
            新建资源
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen bg-[hsl(var(--surface))] p-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold tracking-tighter text-[hsl(var(--on-surface))]">控制台</h2>
            <p className="text-[hsl(var(--secondary))] font-medium">欢迎回到你的动态工作区。</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--secondary))] w-4 h-4" />
              <Input 
                placeholder="搜索项目..." 
                className="w-full pl-12 pr-4 py-3 bg-[hsl(var(--surface-container-low))] border-none rounded-xl focus:ring-0 focus:bg-[hsl(var(--surface-container-lowest))] transition-colors text-sm font-medium placeholder:text-[hsl(var(--secondary))]/50"
              />
            </div>
            <Button
              onClick={() => setIsProjectDialogOpen(true)}
              className="signature-gradient text-white px-6 py-6 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-transform active:scale-95 border-0"
            >
              <Plus className="w-5 h-5" />
              新建项目
            </Button>
          </div>
        </header>

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

          {/* Create New Project Card */}
          <Card
            onClick={() => setIsProjectDialogOpen(true)}
            className="group cursor-pointer bg-[hsl(var(--surface-container-low))] rounded-xl p-4 flex flex-col items-center justify-center border-2 border-dashed border-[hsl(var(--outline-variant))]/30 hover:border-[hsl(var(--primary))]/50 transition-all min-h-[320px] border-0 shadow-none"
          >
            <div className="w-16 h-16 rounded-full bg-[hsl(var(--surface-container))] flex items-center justify-center text-[hsl(var(--primary))] mb-4 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-8 h-8" />
            </div>
            <p className="text-[hsl(var(--on-surface))] font-bold">创建新项目</p>
            <p className="text-xs text-[hsl(var(--secondary))] mt-1">开始一个新的编辑板</p>
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
                  <span className="font-bold text-[hsl(var(--primary))]">{activity.target}</span>
                </div>
                <div className="ml-auto text-[10px] text-[hsl(var(--secondary))] font-bold uppercase tracking-widest">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="ml-64 bg-[hsl(var(--surface))] w-[calc(100%-16rem)] py-12 px-8 border-t border-[hsl(var(--outline-variant))]/15">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-[hsl(var(--on-surface))] text-lg">MangaCanvas</span>
            <p className="text-xs text-[hsl(var(--on-secondary-fixed-variant))] mt-1">© 2024 Kinetic Gallery. 保留所有权利。</p>
          </div>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-xs text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] opacity-80 hover:opacity-100 transition-opacity">
              隐私政策
            </Link>
            <Link to="/terms" className="text-xs text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] opacity-80 hover:opacity-100 transition-opacity">
              服务条款
            </Link>
            <Link to="/contact" className="text-xs text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] opacity-80 hover:opacity-100 transition-opacity">
              联系我们
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
