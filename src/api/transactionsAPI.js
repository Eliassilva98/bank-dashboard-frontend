import client from './client'

export const createTransaction = async ({
  type,
  amount,
  targetEmail,
  description
}) => {
  const response = await client.post('/transactions', {
    type,
    amount,
    ...(type === 'transfer' ? { targetEmail } : {}),
    description
  })

  return response.data
}

export const getTransactions = async ({ page = 1, pageSize = 10 } = {}) => {
  const response = await client.get('/transactions', {
    params: { page, pageSize }
  })

  return response.data
}
