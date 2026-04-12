export interface OuoUploadResult {
  url: string
}

export interface OuoCreateTaskParams {
  styleId: number
  aspectRatio: string
  scriptFileUrl: string
  scriptFileName: string
  productionMode: 'INTELLIGENT' | 'MANUAL'
}

export interface OuoTask {
  taskId: number
  title: string
  cover: string
  styleName: string
  createdAt: number
  aspectRatio: string
  productionMode?: string
}

export interface OuoTaskList {
  list: OuoTask[]
  pageNum: number
  pageSize: number
  pages: number
  total: number
}

export interface OuoTaskStatus {
  taskId: number
  splitStatus: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED'
}

export interface OuoTaskDetail {
  taskId: number
  title: string
  cover: string
  styleName: string
  productionMode: string
  createdAt: number
  aspectRatio: string
}

export type OuoGenerationStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED'

export interface OuoEpisodeTaskStatus {
  characterStatus: OuoGenerationStatus
  characterFailReason: string | null
  characterPicStatus: OuoGenerationStatus
  characterPicFailReason: string | null
  sceneStatus: OuoGenerationStatus
  sceneFailReason: string | null
  scenePicStatus: OuoGenerationStatus
  scenePicFailReason: string | null
  shotSplitStatus: OuoGenerationStatus
  shotSplitFailReason: string | null
  videoMergeStatus: OuoGenerationStatus
  videoMergeFailReason: string | null
  autoProcessEnabled: boolean
}

export interface OuoEpisode {
  episodeId: number
  title: string
  cover: string
  episodeTaskStatus: OuoEpisodeTaskStatus
  createdAt: number
}

export interface OuoEpisodeDetail {
  episodeId: number
  title: string
  taskId: number
  content: string
  aspectRatio: string
  cover: string
  videoUrl: string
  createdAt: number
}

export interface OuoCharacter {
  characterId: number
  assetId: string | null
  voice: string | null
  voicePrompt: string | null
  voiceStatus: OuoGenerationStatus
  historyId: number | null
  episodeId: number
  characterName: string
  characterImage: string
  characterThreeViewsPic: string
  description: string
  characterBio: string | null
  characterReferenceImages: string[] | null
  generationStatus: OuoGenerationStatus | null
  failReasonTip: string | null
}

export interface OuoProp {
  propId: number
  historyId: number | null
  propName: string
  propPrompt: string
  propDescription: string | null
  propImage: string
  propReferenceImages: string[] | null
  generationStatus: OuoGenerationStatus | null
  failReasonTip: string | null
}

export interface OuoScene {
  sceneId: number
  historyId: number | null
  episodeId: number
  location: string
  time: string
  type: string
  sceneImage: string
  description: string
  sceneDescription: string | null
  sceneReferenceImages: string[] | null
  generationStatus: OuoGenerationStatus | null
  failReasonTip: string | null
}

export interface OuoMonitor {
  episodeId: number
  characters: OuoCharacter[]
  props: OuoProp[]
  scenes: OuoScene[]
  episodeTaskStatus: OuoEpisodeTaskStatus
  characterPoints: number
  propPoints: number
  scenePoints: number
  audioPoints: number
  videoPoints: number
}

export interface OuoShotAsset {
  url: string
  assetId: string | null
  type: 'character' | 'scene'
  voice: string | null
}

export interface OuoShot {
  shotId: number
  shotSeq: number
  videoDuration: number
  videoUrl: string
  videoPrompt: string | null
  createdAt: number
  videoStatus: OuoGenerationStatus
  failReasonTip: string | null
  enableVideoGeneration: boolean
  assets: Record<string, OuoShotAsset> | null
  videoPoints: number
}

export interface OuoBatchGenerateResult {
  total: number
  successCount: number
  failCount: number
  failureDetails: unknown[]
}

export interface OuoAccountInfo {
  balance: number
  deductionAmount: number
  giftAmount: number
  rechargeAmount: number
  remainingPercentage: number
}

export interface OuoVideoMergeHistory {
  historyId: number
  episodeId: number
  mergeUrl: string
  status: OuoGenerationStatus
  failReason: string
  createdAt: number
}
