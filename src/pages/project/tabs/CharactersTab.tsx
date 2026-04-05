import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Trash2, Copy, Pencil } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import { useProjectStore } from "@/stores/projectStore"
import type { Character } from "@/types"

interface CharactersTabProps {
  onAddNew?: () => void
}

export default function CharactersTab({ onAddNew }: CharactersTabProps) {
  const characters = useProjectStore((state) => state.assets.characters)
  const { deleteCharacter, duplicateCharacter, openDrawer } = useProjectStore()
  const { confirm, notify } = useFeedback()

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: "删除角色",
      description: "删除后将无法恢复这个角色资料。",
      confirmText: "删除",
      tone: "danger",
    })

    if (confirmed) {
      deleteCharacter(id)
      notify.success("角色已删除")
    }
  }

  const handleDuplicate = (character: Character) => {
    duplicateCharacter(character.id)
  }

  const handleEdit = (character: Character) => {
    notify.info(`编辑角色：${character.name}（编辑功能完整实现中）`)
  }

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew()
    } else {
      openDrawer('character')
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {/* Add New Character Card */}
      <div
        onClick={handleAddNew}
        className="aspect-[4/5] bg-[hsl(var(--surface-container))] border-2 border-dashed border-[hsl(var(--outline-variant))] flex flex-col items-center justify-center rounded-lg hover:bg-[hsl(var(--surface-container-low))] transition-all cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-full bg-[hsl(var(--surface-container-high))] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Plus className="w-5 h-5 text-[hsl(var(--primary))]" />
        </div>
        <span className="text-sm font-bold text-[hsl(var(--on-surface-variant))]">添加角色</span>
        <span className="text-[10px] text-[hsl(var(--secondary))] mt-1">新建设定</span>
      </div>

      {/* Character Cards */}
      {characters.map((character) => (
        <div 
          key={character.id}
          className="group relative bg-[hsl(var(--surface-container-lowest))] rounded-lg overflow-hidden hover:shadow-lg hover:shadow-[hsl(var(--on-surface))]/5 transition-all hover:-translate-y-0.5"
        >
          <div className="aspect-[4/5] w-full relative overflow-hidden">
            <img 
              src={character.image} 
              alt={character.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2 flex gap-1">
              <Badge 
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase border-0 ${
                  character.role === "主角" 
                    ? "bg-[hsl(var(--primary))] text-white" 
                    : "bg-[hsl(var(--secondary))] text-white"
                }`}
              >
                {character.role}
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--on-surface))]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <div className="flex gap-1.5 w-full">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleEdit(character)}
                  className="flex-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold py-1.5 rounded-md border border-white/30 hover:bg-white/40 transition-colors h-auto"
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  编辑
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="secondary"
                      size="icon"
                      className="w-7 h-7 bg-white/20 backdrop-blur-md text-white rounded-md border border-white/30 hover:bg-white/40 transition-colors"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => handleDuplicate(character)}>
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(character.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="p-2.5">
            <h3 className="text-xs font-bold text-[hsl(var(--on-surface))] truncate">{character.name}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[9px] text-[hsl(var(--secondary))] truncate max-w-[60%]">{character.style}</span>
              <span className="text-[9px] text-[hsl(var(--secondary))]">{character.scenes}场景</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
