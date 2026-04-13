import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[90vw] p-0 gap-0 bg-[#0a0c12] border-white/10 rounded-2xl overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-white/10">
          <DialogTitle className="text-xl font-semibold text-white">剧本摘要</DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
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
      </DialogContent>
    </Dialog>
  )
}
