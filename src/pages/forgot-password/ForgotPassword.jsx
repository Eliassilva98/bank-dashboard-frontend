import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { forgotPassword } from '@/api/authAPI'
import Card from '@/components/ui/card/Card'
import PageContainer from '@/components/ui/pageContainer/PageContainer'
import PageHeader from '@/components/ui/pageHeader/PageHeader'
import TextField from '@/components/ui/textField/TextField'
import ErrorMessage from '@/components/ui/errorMessage/ErrorMessage'
import Button from '@/components/ui/button/Button'
import { Container, Form } from '@/pages/login/styles'

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm()

  const [apiError, setApiError] = useState(null)

  const onSubmit = async (data) => {
    setApiError(null)

    try {
      await forgotPassword(data.email)
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Erro inesperado. Tente novamente.')
    }
  }

  if (isSubmitSuccessful && !apiError) {
    return (
      <PageContainer>
        <Container>
          <Card>
            <PageHeader
              title='Verifique seu e-mail.'
              description='Se esse e-mail estiver cadastrado, você receberá um link para redefinir a senha.'
            />
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
            title='Recuperar senha.'
            description='Informe seu e-mail para receber o link de redefinição.'
          />
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              id='email'
              label='E-mail'
              type='email'
              placeholder='Digite seu e-mail'
              error={errors.email?.message}
              registerProps={register('email', {
                required: 'Informe o e-mail.',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail inválido.' }
              })}
            />
            <ErrorMessage>{apiError}</ErrorMessage>
            <Button type='submit' isLoading={isSubmitting}>
              Enviar link
            </Button>
          </Form>
        </Card>
      </Container>
    </PageContainer>
  )
}

export default ForgotPassword