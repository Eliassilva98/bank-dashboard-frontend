import { useState } from 'react'
import Modal from '@/components/ui/modal/Modal'
import { createTransaction } from '@/api/transactionsAPI'
import { useToast } from '@/components/ui/toast/ToastContext'
import { getApiErrorMessage } from '@/utils/apiError'
import { Form, TypeGroup, TypeButton, Field, Label, Input, SubmitButton, FormError } from './styles'
import { formatCurrency } from '@/utils/formatCurrency'

const TransactionModal = ({ onClose, onTransactionCreated }) => {
  const [type, setType] = useState('deposit')
  const [amount, setAmount] = useState('')
  const [targetEmail, setTargetEmail] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const { showToast } = useToast()

  const isTransfer = type === 'transfer'
  const parsedAmount = Number(amount.replace(',', '.'))

  const isValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0
  const isValidTarget = !isTransfer || targetEmail.trim() !== ''

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isValidAmount) {
      setError('Informe um valor maior que zero.')
      return
    }

    if (!isValidTarget) {
      setError('Informe o e-mail da conta de destino.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createTransaction({
        type,
        amount: parsedAmount,
        description: description.trim() || undefined,
        ...(isTransfer && { targetEmail: targetEmail.trim() })
      })

      onTransactionCreated(result)
      onClose()
      showToast({
        type: 'success',
        message: isTransfer
          ? `Transferência de ${formatCurrency(parsedAmount)} realizada!`
          : `Depósito de ${formatCurrency(parsedAmount)} realizado!`
      })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível completar a transação.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title='Nova transação' onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <TypeGroup role='group' aria-label='Tipo de transação'>
          <TypeButton
            type='button'
            $active={type === 'deposit'}
            onClick={() => setType('deposit')}
          >
            Depósito
          </TypeButton>

          <TypeButton
            type='button'
            $active={type === 'transfer'}
            onClick={() => setType('transfer')}
          >
            Transferência
          </TypeButton>
        </TypeGroup>

        <Field>
          <Label htmlFor='transaction-amount'>Valor</Label>
          <Input
            id='transaction-amount'
            type='number'
            min='0.01'
            step='0.01'
            placeholder='0,00'
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </Field>

        {isTransfer && (
          <Field>
            <Label htmlFor='transaction-target'>Conta de destino</Label>
            <Input
              id='transaction-target'
              type='email'
              placeholder='seuemail@.com'
              value={targetEmail}
              onChange={(event) => setTargetEmail(event.target.value)}
            />
          </Field>
        )}

        <Field>
          <Label htmlFor='transaction-description'>Descrição (Opcional)</Label>
          <Input
            id='transaction-description'
            type='text'
            placeholder='Ex: Aluguel, presente...'
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>

        {error && <FormError role='alert'>{error}</FormError>}

        <SubmitButton type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Processando' : isTransfer ? 'Transferir' : 'Depositar'}
        </SubmitButton>
      </Form>
    </Modal>
  )
}

export default TransactionModal