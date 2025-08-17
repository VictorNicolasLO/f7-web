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
    setError,
    setValue
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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^a-z0-9]/g, "");
    setValue("username", filtered); // "username" is the field name
  }

  return (
    <Flex align={"center"} justify="center" height="100vh">
      <form onSubmit={onSubmit}>
        <Stack gap="4" align="center" width={'sm'} maxWidth={'xs'} >
          <Heading size="5xl" textStyle={'title'} letterSpacing={'5px'} >Flash 7</Heading>
          {/* <Field.Root invalid={!!errors.username}>
            <Field.Label>Username</Field.Label>
            <Input {...register("username")} autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              onChange={handleChange} maxLength={20} />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>PassKey</Field.Label>
            <PasswordInput {...register("password")} />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            <Field.HelperText>Dont forget your passkey, it will be always the same for your user.</Field.HelperText>
          </Field.Root>


          <Button type="submit" loading={authStatus === 'authenticating'} loadingText="Accessing...">Access</Button> */}
        </Stack>
      </form>
    </Flex>

  )
}
export default memo(Login) 