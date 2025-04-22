import vine from '@vinejs/vine'

export const mediaValidator = {
  getMediaById: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  ),

  createMedia: vine.compile(
    vine.object({
      post_id: vine.number().positive(),
      type: vine.string().trim().minLength(1).maxLength(50),
      url: vine.string().trim().minLength(1).maxLength(2000)
    })
  ),

  updateMedia: vine.compile(
    vine.object({
      type: vine.string().trim().minLength(1).maxLength(50).optional(),
      url: vine.string().trim().minLength(1).maxLength(2000).optional()
    })
  ),

  deleteMedia: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  )
}