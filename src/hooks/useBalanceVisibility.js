import { useCallback, useState } from 'react'

const STORAGE_KEY = 'balance-hidden'

const readStoredValue = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const storeValue = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    return
  }
}

const useBalanceVisibility = () => {
  const [isHidden, setIsHidden] = useState(readStoredValue)

  const toggle = useCallback(() => {
    setIsHidden((current) => {
      const next = !current

      storeValue(next)

      return next
    })
  }, [])

  return { isHidden, toggle }
}

export default useBalanceVisibility
