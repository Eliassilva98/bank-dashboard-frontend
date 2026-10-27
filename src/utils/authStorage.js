const TOKEN_KEY = '@fintech:token'
const USER_KEY = '@fintech:user'

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  getUser: () => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  },

  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),

  saveSession: ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}
