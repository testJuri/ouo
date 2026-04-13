import { appClient } from './clients/appClient'
import { requestData } from './core/response'
import type {
  OuoUploadResult,
  OuoCreateTaskParams,
  OuoTaskList,
  OuoTaskStatus,
  OuoTaskDetail,
  OuoEpisode,
  OuoEpisodeDetail,
  OuoMonitor,
  OuoAccountInfo,
  OuoShot,
  OuoBatchGenerateResult,
  OuoVideoMergeHistory,
} from './ouoTypes'

export const ouoApi = {
  uploadFile(file: File, group = 'project-doc') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('group', group)
    return requestData<OuoUploadResult>(appClient, {
      method: 'POST',
      url: '/common/upload',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  createTask(params: OuoCreateTaskParams) {
    return requestData<number>(appClient, {
      method: 'POST',
      url: '/task/create',
      data: params,
    })
  },

  getMyTasks(page = 1, pageSize = 20) {
    return requestData<OuoTaskList>(appClient, {
      method: 'GET',
      url: '/task/my-tasks',
      params: { page, pageSize },
    })
  },

  getTaskStatus(taskId: number) {
    return requestData<OuoTaskStatus>(appClient, {
      method: 'GET',
      url: '/task/status',
      params: { taskId },
    })
  },

  getTaskDetail(taskId: number) {
    return requestData<OuoTaskDetail>(appClient, {
      method: 'GET',
      url: '/task/detail',
      params: { taskId },
    })
  },

  getTaskEpisodes(taskId: number) {
    return requestData<OuoEpisode[]>(appClient, {
      method: 'GET',
      url: '/task/episodes',
      params: { taskId },
    })
  },

  getEpisodeDetail(episodeId: number) {
    return requestData<OuoEpisodeDetail>(appClient, {
      method: 'GET',
      url: '/episode/detail',
      params: { episodeId },
    })
  },

  getEpisodeMonitor(episodeId: number) {
    return requestData<OuoMonitor>(appClient, {
      method: 'GET',
      url: '/episode/monitor',
      params: { episodeId },
    })
  },

  autoProcessEpisode(episodeId: number) {
    return requestData<null>(appClient, {
      method: 'POST',
      url: '/task/episode/autoProcess',
      data: { episodeId },
    })
  },

  generateCharacterPic(characterId: number) {
    return requestData<null>(appClient, {
      method: 'POST',
      url: '/character/pic/generate',
      data: { characterId },
    })
  },

  getAccountInfo() {
    return requestData<OuoAccountInfo>(appClient, {
      method: 'GET',
      url: '/account/info',
    })
  },

  generateScenePic(sceneId: number, scenePrompt?: string, sceneReferenceImages?: string[]) {
    const data: Record<string, unknown> = { sceneId }
    if (scenePrompt !== undefined) data.scenePrompt = scenePrompt
    if (sceneReferenceImages !== undefined) data.sceneReferenceImages = sceneReferenceImages
    return requestData<null>(appClient, {
      method: 'POST',
      url: '/scene/pic/generate',
      data,
    })
  },

  regenerateProp(propId: number) {
    return requestData<null>(appClient, {
      method: 'POST',
      url: '/prop/regenerate',
      data: { propId },
    })
  },

  splitEpisodeShots(episodeId: number) {
    return requestData<null>(appClient, {
      method: 'POST',
      url: '/episode/shot/split',
      data: { episodeId },
    })
  },

  getEpisodeShots(episodeId: number) {
    return requestData<OuoShot[]>(appClient, {
      method: 'GET',
      url: '/task/episode/shots',
      params: { episodeId },
    })
  },

  regenerateShot(shotId: number) {
    return requestData<null>(appClient, {
      method: 'POST',
      url: '/shot/regenerate',
      data: { shotId },
    })
  },

  batchGenerateShots(episodeId: number) {
    return requestData<OuoBatchGenerateResult>(appClient, {
      method: 'POST',
      url: '/shot/generate/batch',
      data: { episodeId },
    })
  },

  mergeEpisodeVideo(episodeId: number) {
    return requestData<null>(appClient, {
      method: 'POST',
      url: '/episode/video/merge',
      data: { episodeId },
    })
  },

  getVideoMergeHistory(episodeId: number) {
    return requestData<OuoVideoMergeHistory[]>(appClient, {
      method: 'GET',
      url: '/history/video-merge/list',
      params: { episodeId },
    })
  },

  createCharacter(episodeId: number, characterName: string, characterPrompt: string) {
    return requestData<null>(appClient, {
      method: 'POST',
      url: '/character/create',
      data: { episodeId, characterName, characterPrompt },
    })
  },

  createScene(episodeId: number, sceneLocation: string, scenePrompt: string) {
    return requestData<null>(appClient, {
      method: 'POST',
      url: '/scene/create',
      data: { episodeId, sceneLocation, scenePrompt },
    })
  },

  createProp(episodeId: number, propName: string, propPrompt: string) {
    return requestData<null>(appClient, {
      method: 'POST',
      url: '/prop/create',
      data: { episodeId, propName, propPrompt },
    })
  },

  addShot(shotId: number, addLocation: 'before' | 'after') {
    return requestData<null>(appClient, {
      method: 'POST',
      url: '/shot/add',
      data: { shotId, addLocation },
    })
  },
}
