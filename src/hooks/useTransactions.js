import { useCallback, useEffect, useState } from 'react'
import { getTransactions } from '@/api/transactionsAPI'
import { getApiErrorMessage } from '@/utils/apiError'

const FALLBACK_ERROR = 'Não foi possível carregar o extrato.'

const useTransactions = ({ pageSize = 10 } = {}) => {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    const startFetching = async () => {
      try {
        const data = await getTransactions({ page, pageSize })

        if (!ignore) {
          setItems(data.items ?? [])
          setTotal(data.total ?? 0)
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
  }, [page, pageSize])

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getTransactions({ page, pageSize })
      setItems(data.items ?? [])
      setTotal(data.total ?? 0)
      return data
    } catch (err) {
      setError(getApiErrorMessage(err, FALLBACK_ERROR))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize])

  return {
    items,
    page,
    total,
    setPage,
    isLoading,
    error,
    refetch
  }
}

export default useTransactions
