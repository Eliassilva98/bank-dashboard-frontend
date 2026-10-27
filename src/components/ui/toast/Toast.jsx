import { FiX } from 'react-icons/fi'
import { ToastItem, CloseButton } from './styles'

const Toast = ({ $type, onClose, children }) => {
  return (
    <ToastItem $type={$type} role='status'>
      {children}

      <CloseButton type='button' onClick={onClose} aria-label='Fechar'>
        <FiX size={16} />
      </CloseButton>
    </ToastItem>
  )
}

export default Toast