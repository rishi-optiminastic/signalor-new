import { useEffect, useState } from 'react'

/** True after first client mount — gate persisted/client-only reads to avoid hydration mismatch. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
