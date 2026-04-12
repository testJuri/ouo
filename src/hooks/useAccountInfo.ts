import { useState, useEffect } from 'react'
import { ouoApi } from '@/api/ouoApi'
import type { OuoAccountInfo } from '@/api/ouoTypes'

export function useAccountInfo() {
  const [accountInfo, setAccountInfo] = useState<OuoAccountInfo | null>(null)

  const fetchAccountInfo = async () => {
    try {
      const data = await ouoApi.getAccountInfo()
      setAccountInfo(data)
    } catch {
      // silently fail for account info
    }
  }

  useEffect(() => {
    fetchAccountInfo()
  }, [])

  return { accountInfo, refresh: fetchAccountInfo }
}
