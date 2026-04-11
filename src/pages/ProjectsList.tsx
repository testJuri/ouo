import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  Plus, 
  Folder, 
  MoreVertical, 
  Clock,
  Users,
  Search,
  Filter,
  Grid3X3,
  List
} from "lucide-react"

// 模拟项目数据
const mockProjects = [
  {
    id: "1",
    name: "科幻短片《星际穿越》",
    description: "关于时间旅行与亲情的科幻故事",
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    lastModified: "2024-04-10",
    episodeCount: 5,
    collaborators: 3,
    status: "进行中",
  },
  {
    id: "2",
    name: "古风漫画《长安十二时辰》",
    description: "唐朝背景的历史悬疑故事",
    cover: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
    lastModified: "2024-04-08",
    episodeCount: 12,
    collaborators: 5,
    status: "进行中",
  },
  {
    id: "3",
    name: "现代都市《北漂日记》",
    description: "年轻人在北京的奋斗故事",
    cover: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop",
    lastModified: "2024-04-05",
    episodeCount: 8,
    collaborators: 2,
    status: "已完成",
  },
  {
    id: "4",
    name: "悬疑推理《迷雾》",
    description: "小镇连续失踪案的真相",
    cover: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=400&h=300&fit=crop",
    lastModified: "2024-04-01",
    episodeCount: 3,
    collaborators: 4,
    status: "草稿",
  },
  {
    id: "5",
    name: "爱情片《夏日限定》",
    description: "海边小镇的夏日恋情",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    lastModified: "2024-03-28",
    episodeCount: 6,
    collaborators: 3,
    status: "进行中",
  },
  {
    id: "6",
    name: "恐怖片《午夜回廊》",
    description: "老宅中的诡异事件",
    cover: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=400&h=300&fit=crop",
    lastModified: "2024-03-25",
    episodeCount: 4,
    collaborators: 2,
    status: "草稿",
  },
]

export default function ProjectsList() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Title */}
            <div className="flex items-center gap-4">
              <Link to="/" className="text-white font-semibold text-lg hover:text-white/80 transition-colors">
                ← 返回
              </Link>
              <h1 className="text-xl font-bold text-white">我的项目</h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white/15 text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white/15 text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* New Project Button */}
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-all"
              >
                <Plus className="w-4 h-4" />
                新建项目
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="搜索项目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Folder className="w-16 h-16 text-white/20 mb-4" />
            <h3 className="text-xl font-medium text-white/60 mb-2">暂无项目</h3>
            <p className="text-white/40 mb-6">创建你的第一个项目开始创作</p>
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              新建项目
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="group block bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:bg-white/[0.07] transition-all"
              >
                {/* Cover */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.cover}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white line-clamp-1 group-hover:text-white/90">
                      {project.name}
                    </h3>
                    <button className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-white/50 line-clamp-1 mb-3">
                    {project.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.lastModified}
                      </span>
                      <span className="flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        {project.episodeCount} 集
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      project.status === "已完成"
                        ? "bg-green-500/20 text-green-400"
                        : project.status === "进行中"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/[0.07] transition-all"
              >
                {/* Cover */}
                <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={project.cover}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white line-clamp-1 group-hover:text-white/90">
                    {project.name}
                  </h3>
                  <p className="text-sm text-white/50 line-clamp-1">
                    {project.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-6 text-sm text-white/40">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {project.lastModified}
                  </span>
                  <span className="flex items-center gap-1">
                    <Folder className="w-4 h-4" />
                    {project.episodeCount} 集
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.collaborators} 人
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === "已完成"
                      ? "bg-green-500/20 text-green-400"
                      : project.status === "进行中"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Actions */}
                <button className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
