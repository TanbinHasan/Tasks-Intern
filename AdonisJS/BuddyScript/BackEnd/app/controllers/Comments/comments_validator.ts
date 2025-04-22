import vine from '@vinejs/vine'

export const commentsValidator = {
  getCommentById: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  ),

  createComment: vine.compile(
    vine.object({
      post_id: vine.number().positive(),
      text: vine.string().trim().minLength(1).maxLength(1000)
    })
  ),

  updateComment: vine.compile(
    vine.object({
      text: vine.string().trim().minLength(1).maxLength(1000)
    })
  ),

  deleteComment: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  ),

  likeComment: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  ),

  unlikeComment: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  )
}