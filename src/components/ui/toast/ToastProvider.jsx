import { useCallback, useMemo, useRef, useState } from 'react'
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi'
import { ToastContext } from './ToastContext'
import Toast from './Toast'
import { ToastViewport } from './styles'

const ICONS = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo
}

const AUTO_DISMISS_MS = 4000

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const nextIdRef = useRef(0)

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ type = 'info', message }) => {
      nextIdRef.current += 1
      const id = nextIdRef.current

      setToasts((current) => [...current, { id, type, message }])

      setTimeout(() => removeToast(id), AUTO_DISMISS_MS)
    },
    [removeToast]
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <ToastViewport>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] ?? FiInfo

          return (
            <Toast
              key={toast.id}
              $type={toast.type}
              onClose={() => removeToast(toast.id)}
            >
              <Icon size={18} aria-hidden='true' />
              <span>{toast.message}</span>
            </Toast>
          )
        })}
      </ToastViewport>
    </ToastContext.Provider>
  )
}

