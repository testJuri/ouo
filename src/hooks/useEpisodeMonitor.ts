import { useState, useEffect, useCallback, useRef } from 'react'
import { ouoApi } from '@/api/ouoApi'
import type { OuoMonitor } from '@/api/ouoTypes'

const POLL_INTERVAL = 4000

function hasRunningTasks(monitor: OuoMonitor): boolean {
  const s = monitor.episodeTaskStatus
  const statuses = [
    s.characterStatus,
    s.characterPicStatus,
    s.sceneStatus,
    s.scenePicStatus,
    s.shotSplitStatus,
    s.videoMergeStatus,
  ]
  if (statuses.some((st) => st === 'RUNNING')) return true

  const hasRunningCharacter = monitor.characters.some(
    (c) => c.generationStatus === 'RUNNING' || c.voiceStatus === 'RUNNING'
  )
  const hasRunningProp = monitor.props.some((p) => p.generationStatus === 'RUNNING')
  const hasRunningScene = monitor.scenes.some((s) => s.generationStatus === 'RUNNING')

  return hasRunningCharacter || hasRunningProp || hasRunningScene
}

export function useEpisodeMonitor(episodeId: number | undefined) {
  const [monitor, setMonitor] = useState<OuoMonitor | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPollingRef = useRef(false)

  const fetchMonitor = useCallback(async () => {
    if (!episodeId) return
    try {
      const data = await ouoApi.getEpisodeMonitor(episodeId)
      setMonitor(data)
      setError(null)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取状态失败')
      return null
    }
  }, [episodeId])

  const startPolling = useCallback(() => {
    if (isPollingRef.current) return
    isPollingRef.current = true
    intervalRef.current = setInterval(async () => {
      const data = await fetchMonitor()
      if (data && !hasRunningTasks(data)) {
        stopPolling()
      }
    }, POLL_INTERVAL)
  }, [fetchMonitor])

  const stopPolling = useCallback(() => {
    isPollingRef.current = false
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await fetchMonitor()
    setLoading(false)
    if (data && hasRunningTasks(data)) {
      startPolling()
    }
    return data
  }, [fetchMonitor, startPolling])

  useEffect(() => {
    if (!episodeId) return
    setLoading(true)
    fetchMonitor().then((data) => {
      setLoading(false)
      if (data && hasRunningTasks(data)) {
        startPolling()
      }
    })
    return () => stopPolling()
  }, [episodeId, fetchMonitor, startPolling, stopPolling])

  return { monitor, loading, error, refresh, startPolling, stopPolling }
}
