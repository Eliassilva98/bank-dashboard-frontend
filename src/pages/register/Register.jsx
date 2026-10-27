import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { register as registerUser } from '@/api/authAPI'
import Card from '@/components/ui/card/Card'
import PageContainer from '@/components/ui/pageContainer/PageContainer'
import PageHeader from '@/components/ui/pageHeader/PageHeader'
import TextField from '@/components/ui/textField/TextField'
import Button from '@/components/ui/button/Button'
import ErrorMessage from '@/components/ui/errorMessage/ErrorMessage'
import Link from '@/components/ui/link/Link'
import FooterText from '@/components/ui/footerText/FooterText'
import { Container, Form } from '@/pages/login/styles'

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const navigate = useNavigate()
  const [apiError, setApiError] = useState(null)

  const onSubmit = async (data) => {
    setApiError(null)

    try {
      await registerUser(data)
      navigate('/login')
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Erro inesperado. Tente novamente.')
    }
  }

  return (
    <PageContainer>
      <Container>
        <Card>
          <PageHeader
            title='Criar conta.'
            description='Preencha os dados para começar.'
          />
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              id='name'
              label='Nome'
              placeholder='Digite seu nome'
              autoComplete='name'
              error={errors.name?.message}
              registerProps={register('name', { required: 'Informe o nome.' })}
            />
            <TextField
              id='email'
              label='E-mail'
              type='email'
              placeholder='Digite seu e-mail'
              autoComplete='email'
              error={errors.email?.message}
              registerProps={register('email', {
                required: 'Informe o e-mail',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail inválido.' }
              })}
            />
            <TextField
              id='password'
              label='Senha'
              type='password'
              placeholder='Digite sua senha'
              autoComplete='new-password'
              error={errors.password?.message}
              registerProps={register('password', {
                required: 'Informe a senha.',
                minLength: { value: 8, message: 'Senha deve conter no mínimo 8 caracteres.' }

              })}
            />
            <ErrorMessage>{apiError}</ErrorMessage>
            <Button type='submit' isLoading={isSubmitting}>
              Criar conta
            </Button>
          </Form>
          <FooterText>
            Já tem conta? <Link to='/login'>Entre</Link>
          </FooterText>
        </Card>
      </Container>
    </PageContainer>
  )
}

export default Register