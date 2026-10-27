import { useCallback, useEffect, useState } from 'react'
import { getAccountOverview } from '@/api/accountAPI'
import { getApiErrorMessage } from '@/utils/apiError'

const FALLBACK_ERROR = 'Não foi possível carregar sua conta.'

const useAccount = () => {
  const [account, setAccount] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    const startFetching = async () => {
      try {
        const data = await getAccountOverview()

        if (!ignore) {
          setAccount(data)
          setError(null)
        }
      } catch (err) {
        if (!ignore) {
          setError(getApiErrorMessage(err, FALLBACK_ERROR))
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    startFetching()

    return () => {
      ignore = true
    }
  }, [])

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getAccountOverview()
      setAccount(data)
      return data
    } catch (err) {
      setError(getApiErrorMessage(err, FALLBACK_ERROR))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const applyBalance = useCallback((newBalance) => {
    setAccount((current) =>
      current
        ? { ...current, account: { ...current.account, balance: newBalance } }
        : current
    )
  }, [])

  return { account, isLoading, error, refetch, applyBalance }
}

export default useAccount
