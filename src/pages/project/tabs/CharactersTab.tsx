import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Trash2, Copy, Pencil } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Character {
  id: number
  name: string
  image: string
  role: "主角" | "配角"
  style: string
  scenes: number
  gender?: string
  ageGroup?: string
  genMethod?: string
  model?: string
  description?: string
}

interface CharactersTabProps {
  onAddNew: () => void
  characters?: Character[]
  onCharactersChange?: (characters: Character[]) => void
}

const initialCharacters: Character[] = [
  {
    id: 1,
    name: "龙崎真治",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=400&fit=crop",
    role: "主角",
    style: "赛博朋克",
    scenes: 12
  },
  {
    id: 2,
    name: "月城雪兔",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop",
    role: "配角",
    style: "传统水墨",
    scenes: 8
  },
  {
    id: 3,
    name: "神乐千鹤",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
    role: "主角",
    style: "现代写实",
    scenes: 15
  },
  {
    id: 4,
    name: "黑崎一护",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop",
    role: "配角",
    style: "热血少年",
    scenes: 6
  },
  {
    id: 5,
    name: "春野樱",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop",
    role: "主角",
    style: "治愈系",
    scenes: 10
  },
  {
    id: 6,
    name: "佐藤健",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    role: "配角",
    style: "科幻风",
    scenes: 7
  },
  {
    id: 7,
    name: "林小北",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop",
    role: "主角",
    style: "青春校园",
    scenes: 18
  },
  {
    id: 8,
    name: "陈默",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
    role: "配角",
    style: "悬疑暗黑",
    scenes: 9
  },
  {
    id: 9,
    name: "白浅",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
    role: "主角",
    style: "古风仙侠",
    scenes: 20
  },
  {
    id: 10,
    name: "韩立",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop",
    role: "配角",
    style: "修仙玄幻",
    scenes: 5
  },
  {
    id: 11,
    name: "苏沐橙",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop",
    role: "主角",
    style: "电竞少女",
    scenes: 14
  },
  {
    id: 12,
    name: "叶修",
    image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300&h=400&fit=crop",
    role: "配角",
    style: "成熟稳重",
    scenes: 11
  }
]

export default function CharactersTab({ onAddNew, characters: externalCharacters, onCharactersChange }: CharactersTabProps) {
  const [internalCharacters, setInternalCharacters] = useState<Character[]>(initialCharacters)
  
  const characters = externalCharacters ?? internalCharacters
  const setCharacters = onCharactersChange ?? setInternalCharacters

  const handleDelete = (id: number) => {
    if (confirm("确定要删除这个角色吗？")) {
      setCharacters(characters.filter(c => c.id !== id))
    }
  }

  const handleDuplicate = (character: Character) => {
    const newCharacter: Character = {
      ...character,
      id: Math.max(...characters.map(c => c.id), 0) + 1,
      name: `${character.name} (复制)`,
      scenes: 0,
    }
    setCharacters([newCharacter, ...characters])
  }

  const handleEdit = (character: Character) => {
    alert(`编辑角色: ${character.name}\n（编辑功能完整实现中）`)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {/* Add New Character Card */}
      <div
        onClick={onAddNew}
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
