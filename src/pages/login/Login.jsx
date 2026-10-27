import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { login } from '@/api/authAPI'
import { useAuth } from '@/context/useAuth'
import TextField from '@/components/ui/textField/TextField'
import Button from '@/components/ui/button/Button'
import ErrorMessage from '@/components/ui/errorMessage/ErrorMessage'
import Card from '@/components/ui/card/Card'
import PageContainer from '@/components/ui/pageContainer/PageContainer'
import PageHeader from '@/components/ui/pageHeader/PageHeader'
import Link from '@/components/ui/link/Link'
import FooterText from '@/components/ui/footerText/FooterText'
import { Container, Form, ForgotPasswordWrapper } from './styles'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const navigate = useNavigate()
  const { login: saveAuth } = useAuth()
  const [apiError, setApiError] = useState(null)

  const onSubmit = async (data) => {
    setApiError(null)

    try {
      const response = await login(data)
      saveAuth(response.data)
      navigate('/')
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Erro inesperado. Tente novamente.')
    }
  }

  return (
    <PageContainer>
      <Container>
        <Card>
          <PageHeader
            title='Entrar'
            description='Acesse sua conta para continuar'
          />
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              id='email'
              label='E-mail'
              placeholder='Digite seu e-mail'
              autoComplete='email'
              error={errors.email?.message}
              registerProps={register('email', {
                required: 'Informe o email',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail inválido' }
              })}
            />

            <TextField
              id='password'
              label='Senha'
              type='password'
              placeholder='digite sua senha'
              autoComplete='current-password'
              error={errors.password?.message}
              registerProps={register('password', {
                required: 'Informe a senha',
                minLength: { value: 8, message: 'Senha deve conter no mínimo 8 caracteres' }
              })}
            />
            <ForgotPasswordWrapper>
              <Link to='/forgot-password' variant='ghost' underline>
                Esqueçeu sua senha?
              </Link>
            </ForgotPasswordWrapper>

            <ErrorMessage>{apiError}</ErrorMessage>

            <Button type='submit' isLoading={isSubmitting}>
              Entrar
            </Button>
          </Form>
          <FooterText>
            Não tem conta? <Link to='/register'>Abra a sua</Link>
          </FooterText>
        </Card>
      </Container>
    </PageContainer>
  )
}

export default Login