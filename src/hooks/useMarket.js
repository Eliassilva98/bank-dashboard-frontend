import { useState, useEffect } from 'react'
import { getMarketOverview } from '@/api/marketAPI'
import { getApiErrorMessage } from '@/utils/apiError'

const FALLBACK_ERROR = 'Não foi possível carregar os dados do mercado.'

const useMarket = () => {
  const [market, setMarket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    const loadMarket = async () => {
      try {
        const data = await getMarketOverview()

        if (!ignore) {
          setMarket(data)
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
    loadMarket()
  }, [])

  return { market, isLoading, error }
}

export default useMarket
