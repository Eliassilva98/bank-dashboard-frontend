import client from './client'

export const getMarketOverview = async () => {
  const response = await client.get('/market')

  return response.data
}
