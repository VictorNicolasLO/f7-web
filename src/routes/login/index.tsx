import {Button, Field, Flex, Input, Stack, } from "@chakra-ui/react"
import { PasswordInput } from "../../components/ui/password-input"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"


interface FormValues {
  username: string
  password: string
}

const Login = () => {
  console.log('render')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()
  const navigate = useNavigate()
  const onSubmit = handleSubmit((data: FormValues) => navigate('/home'))
  return (
    <Flex align={"center"} justify="center" height="100vh">
      <form onSubmit={onSubmit}>
        <Stack gap="4" align="flex-start" width={'sm'} maxWidth={'xs'} >
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

          <Button type="submit">Access</Button>
        </Stack>
      </form>
    </Flex>

  )
}
export default Login