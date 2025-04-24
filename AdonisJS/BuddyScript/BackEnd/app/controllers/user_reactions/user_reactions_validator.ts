import vine from '@vinejs/vine'

export const userReactionsValidator = {
  getUserReactions: vine.compile(
    vine.object({})
  ),

  getPostReactions: vine.compile(
    vine.object({})
  ),

  getCommentReactions: vine.compile(
    vine.object({})
  ),

  getReplyReactions: vine.compile(
    vine.object({})
  )
}