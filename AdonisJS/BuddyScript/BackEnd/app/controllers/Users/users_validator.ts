import vine from '@vinejs/vine'

export const usersValidator = {
  getUserById: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  ),

  getAllUsers: vine.compile(
    vine.object({})
  )
}