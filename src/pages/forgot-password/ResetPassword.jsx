import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { resetPassword } from '@/api/authAPI'
import Card from '@/components/ui/card/Card'
import PageContainer from '@/components/ui/pageContainer/PageContainer'
import PageHeader from '@/components/ui/pageHeader/PageHeader'
import TextField from '@/components/ui/textField/TextField'
import Button from '@/components/ui/button/Button'
import ErrorMessage from '@/components/ui/errorMessage/ErrorMessage'
import { Container, Form } from '@/pages/login/styles'
import { SuccessAction } from './styles'

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const navigate = useNavigate()
  const [apiError, setApiError] = useState(null)
  const [resetSuccess, setResetSuccess] = useState(false)

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const onSubmit = async (data) => {
    setApiError(null)

    if (!token) {
      setApiError('Link de redefinição inválido ou expirado.')
      return
    }

    try {
      await resetPassword({ token, password: data.password })
      setResetSuccess(true)
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Erro inesperado. Tente novamente.')
    }
  }

  if (resetSuccess) {
    return (
      <PageContainer>
        <Container>
          <Card>
            <PageHeader
              title='Senha redefinida'
              description='Sua senha foi alterada com sucesso. Agora você pode entrar com a nova senha.'
            />
            <SuccessAction>
              <Button type='button' onClick={() => navigate('/login')}>
                Entrar
              </Button>
            </SuccessAction>
          </Card>
        </Container>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Container>
        <Card>
          <PageHeader
            title='Nova senha.'
            description='Defina uma nova senha para sua conta.'
          />
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              id='password'
              label='Nova senha'
              type='password'
              placeholder='Digite a nova senha'
              autoComplete='new-password'
              error={errors.password?.message}
              registerProps={register('password', {
                required: 'Informe a senha',
                minLength: { value: 8, message: 'Senha deve conter no mínimo 8 caracteres.' }
              })}
            />
            <TextField
              id='confirmPassword'
              label='Confirmar nova senha'
              type='password'
              placeholder='Repita a nova senha'
              autoComplete='new-password'
              error={errors.confirmPassword?.message}
              registerProps={register('confirmPassword', {
                required: 'Confirme a senha',
                validate: (value, { password }) =>
                  value === password || 'As senhas não coincidem.'
              })}
            />
            <ErrorMessage>{apiError}</ErrorMessage>

            <Button type='submit' isLoading={isSubmitting}>
              Salvar nova senha
            </Button>
          </Form>
        </Card>
      </Container>
    </PageContainer>
  )
}

export default ResetPassword