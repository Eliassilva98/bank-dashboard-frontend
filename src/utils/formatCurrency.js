export const formatCurrency = (value) => {
  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return '--'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

export const formatUsd = (value) => {
  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return '--'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
