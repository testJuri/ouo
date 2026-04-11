import { X } from "lucide-react"

interface ScriptPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  script: {
    title: string
    scene: string
    plot: string
    twist: string
    ending: string
  }
}

export function ScriptPreviewDialog({
  open,
  onOpenChange,
  script,
}: ScriptPreviewDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#0a0c12] rounded-2xl w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white">剧本摘要</h3>
          <button 
            onClick={() => onOpenChange(false)}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="bg-[#0d1020] rounded-xl p-6 border border-blue-500/20">
            {/* Title */}
            <h4 className="text-lg font-medium text-white mb-6">
              {script.title}
            </h4>
            
            {/* Scene */}
            <div className="mb-6">
              <span className="text-white/90 font-medium">画面：</span>
              <span className="text-white/80 leading-relaxed ml-1">
                {script.scene}
              </span>
            </div>
            
            {/* Plot */}
            <div className="mb-6">
              <span className="text-white/90 font-medium">剧情：</span>
              <span className="text-white/80 leading-relaxed ml-1">
                {script.plot}
              </span>
            </div>
            
            {/* Twist */}
            <div className="mb-6">
              <span className="text-white/90 font-medium">变故：</span>
              <span className="text-white/80 leading-relaxed ml-1">
                {script.twist}
              </span>
            </div>
            
            {/* Ending */}
            <div>
              <span className="text-white/90 font-medium">结尾：</span>
              <span className="text-white/80 leading-relaxed ml-1">
                {script.ending}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
