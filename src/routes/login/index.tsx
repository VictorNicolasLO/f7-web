import { Button, Field, Flex, Heading, Input, Stack, } from "@chakra-ui/react"
import { PasswordInput } from "../../components/ui/password-input"
import { useForm } from "react-hook-form"

import { memo } from "react"
import { useAuth } from "../../hooks/use-auth"


interface FormValues {
  username: string
  password: string
}

const Login = () => {
  const auth = useAuth()
  const authStatus = auth.state.status
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormValues>()

  const onSubmit = handleSubmit((data: FormValues) => {
    if (data.username.trim() === '' || data.username.length < 3) {
      setError('username', { type: 'manual', message: 'Username is required or is too short' })
      return
    }
    if (data.password.trim() === '' || data.password.length < 8) {
      setError('password', { type: 'manual', message: 'Passkey is required or is too short' })
      return
    }
    auth.login(data.username, data.password)
  })
  return (
    <Flex align={"center"} justify="center" height="100vh">
      <form onSubmit={onSubmit}>
        <Stack gap="4" align="flex-start" width={'sm'} maxWidth={'xs'} >
          <Heading size="3xl" textStyle={'title'}>Flash 7</Heading>
          <Field.Root invalid={!!errors.username}>
            <Field.Label>Username</Field.Label>
            <Input {...register("username")} />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>PassKey</Field.Label>
            <PasswordInput {...register("password")} />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            <Field.HelperText>Your passkey will be always the same for your user.</Field.HelperText>
          </Field.Root>


          <Button type="submit" loading={authStatus === 'authenticating'} loadingText="Accessing...">Access</Button>
        </Stack>
      </form>
    </Flex>

  )
}
export default memo(Login) 