import vine from '@vinejs/vine'

export const postsValidator = {
  getPostById: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  ),

  getAllPosts: vine.compile(
    vine.object({
      page: vine.number().positive().optional(),
      limit: vine.number().positive().optional()
    })
  ),

  getPostsOrderedByLikes: vine.compile(
    vine.object({
      page: vine.number().positive().optional(),
      limit: vine.number().positive().optional()
    })
  ),

  createPost: vine.compile(
    vine.object({
      text: vine.string().trim().minLength(1).maxLength(5000)
    })
  ),

  updatePost: vine.compile(
    vine.object({
      text: vine.string().trim().minLength(1).maxLength(5000)
    })
  ),

  deletePost: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  ),

  likePost: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  ),

  unlikePost: vine.compile(
    vine.object({
      id: vine.number().positive()
    })
  )
}