import { useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'
import { Overlay, Dialog, Header, Title, CloseButton, Content } from './styles'

const Modal = ({ title, onClose, children }) => {
  const dialogRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
    dialogRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <Overlay onClick={onClose}>
      <Dialog
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label={title}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <Header>
          <Title>{title}</Title>
          <CloseButton type='button' onClick={onClose} aria-label='Fechar'>
            <FiX size={20} />
          </CloseButton>
        </Header>
        <Content>{children}</Content>
      </Dialog>
    </Overlay>
  )
}

export default Modal