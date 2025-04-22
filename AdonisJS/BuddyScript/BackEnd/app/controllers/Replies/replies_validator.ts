import vine from '@vinejs/vine'

export const repliesValidator = {
  getReplyById: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  ),

  createReply: vine.compile(
    vine.object({
      comment_id: vine.number().positive(),
      text: vine.string().trim().minLength(1).maxLength(1000)
    })
  ),

  updateReply: vine.compile(
    vine.object({
      text: vine.string().trim().minLength(1).maxLength(1000)
    })
  ),

  deleteReply: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  ),

  likeReply: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  ),

  unlikeReply: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  )
}