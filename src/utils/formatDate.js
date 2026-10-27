export const formatDate = (value) => {
  if (!value) {
    return '--'
  }

  if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  return date.toLocaleDateString('pt-BR')
}
