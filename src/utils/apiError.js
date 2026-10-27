export const getApiErrorMessage = (
  error,
  falback = 'Erro inesperado. Tente novamente.'
) => error?.response?.data?.message ?? falback
