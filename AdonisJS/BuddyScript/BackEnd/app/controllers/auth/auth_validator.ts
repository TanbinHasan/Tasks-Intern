import vine from '@vinejs/vine'

export const RegisterValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string(),
    password: vine.string().minLength(5).maxLength(40),
  })
)

export const LoginValidator = vine.compile(
  vine.object({
    email: vine.string(),
    password: vine.string(),
  })
)