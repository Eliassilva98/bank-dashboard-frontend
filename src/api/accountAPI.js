import client from './client'

export const getAccountOverview = async () => {
  const response = await client.get('/accounts/me')

  return response.data
}
