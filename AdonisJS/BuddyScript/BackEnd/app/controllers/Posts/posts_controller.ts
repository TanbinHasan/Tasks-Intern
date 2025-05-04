import { inject } from "@adonisjs/core";
import PostsService from "./posts_service.js";
import { HttpContext } from "@adonisjs/core/http";
import { postsValidator } from "./posts_validator.js";

@inject()
export default class PostsController {
  constructor(
    private postsService: PostsService
  ) { }

  public async getPostById({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.getPostById, {
      data: { id: Number(params.id) }
    })

    try {
      const post = await this.postsService.getPostById(id);

      return response.json({
        status: 'success',
        data: post
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  // Update the getAllPosts method in posts_controller.ts:
  public async getAllPosts({ request, response, auth }: HttpContext) {
    const { page = 1, limit = 5 } = await request.validateUsing(postsValidator.getAllPosts)

    try {
      const paginatedPosts = await this.postsService.getAllPosts(page, limit);

      // Check if posts are liked by the current user
      let currentUserId = null;
      try {
        // Try to get the authenticated user
        const user = await auth.authenticate();
        currentUserId = user.id;
      } catch (authError) {
        // If not authenticated, don't modify likes
      }

      // Transform posts with like status and comment count
      const postsWithLikes = await Promise.all(paginatedPosts.map(async (post) => {
        const postJSON = post.toJSON();

        if (currentUserId) {
          // Check if user has liked this post
          const like = await this.postsService.checkUserLiked(post.id, currentUserId);
          postJSON.isLikedByCurrentUser = !!like;
        }

        // Add comment count
        postJSON.commentCount = post.$extras.comments_count || postJSON.comments?.length || 0;

        return postJSON;
      }));

      // Construct pagination metadata
      const meta = {
        currentPage: page,
        perPage: limit,
        total: paginatedPosts.length > 0 ?
          (page * limit + (paginatedPosts.length < limit ? 0 : 1)) : 0,
        lastPage: paginatedPosts.length < limit ? page : page + 1,
        hasMore: paginatedPosts.length >= limit
      };

      return response.json({
        status: 'success',
        data: postsWithLikes,
        meta
      });
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async getPostsOrderedByLikes({ request, response, params }: HttpContext) {
    const { page = 1, limit = 5 } = await request.validateUsing(postsValidator.getPostsOrderedByLikes, {
      data: {
        page: Number(params.page),
        limit: Number(params.limit)
      }
    })

    try {
      const posts = await this.postsService.getPostsOrderedByLikes(page, limit);

      // Map the results to include only required fields
      const simplifiedPosts = posts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        content: post.text,
        likeCount: post.$extras.likes_count || 0,
        commentCount: post.$extras.comments_count || 0,
      }))

      // Pagination metadata
      const meta = {
        currentPage: page,
        perPage: limit,
        total: posts.length > 0 ? (page * limit + (posts.length < limit ? 0 : 1)) : 0,
        lastPage: posts.length < limit ? page : page + 1,
        hasMore: posts.length >= limit,
      }

      return response.json({
        status: 'success',
        data: simplifiedPosts,
        meta,
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  public async createPost({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(postsValidator.createPost)

    try {
      // Try to get the authenticated user
      let userId;
      try {
        const user = await auth.authenticate();
        userId = user.id;
      } catch (authError) {
        // If authentication fails, check if user_id was provided in request
        userId = request.input('user_id');

        if (!userId) {
          return response.status(401).json({
            status: 'error',
            message: 'Authentication required to create a post'
          });
        }
      }

      const postData = {
        ...data,
        user_id: userId,
        timestamp: Math.floor(Date.now() / 1000)
      }

      const post = await this.postsService.createPost(postData)

      return response.status(201).json({
        status: 'success',
        data: post
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async updatePost({ request, response, params, auth }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.getPostById, {
      data: { id: Number(params.id) }
    })

    const data = await request.validateUsing(postsValidator.updatePost)

    try {
      // Try to get the authenticated user
      let userId;
      try {
        const user = await auth.authenticate();
        userId = user.id;
      } catch (authError) {
        // If authentication fails, check if user_id was provided in request
        userId = request.input('user_id');

        if (!userId) {
          return response.status(401).json({
            status: 'error',
            message: 'Authentication required to update a post'
          });
        }
      }

      const post = await this.postsService.updatePost(id, userId, data)

      return response.json({
        status: 'success',
        data: post
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async deletePost({ request, response, params, auth }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.deletePost, {
      data: { id: Number(params.id) }
    })

    try {
      // Try to get the authenticated user
      let userId;
      try {
        const user = await auth.authenticate();
        userId = user.id;
      } catch (authError) {
        // If authentication fails, check if user_id was provided in request
        userId = request.input('user_id');

        if (!userId) {
          return response.status(401).json({
            status: 'error',
            message: 'Authentication required to delete a post'
          });
        }
      }

      await this.postsService.deletePost(id, userId)

      return response.json({
        status: 'success',
        message: 'Post deleted successfully'
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async getPostMediaItems({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.getPostById, {
      data: { id: Number(params.id) }
    })

    try {
      const mediaItems = await this.postsService.getPostMediaItems(id)

      return response.json({
        status: 'success',
        data: mediaItems
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async getPostLikes({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.getPostById, {
      data: { id: Number(params.id) }
    })

    try {
      const likes = await this.postsService.getPostLikes(id)

      return response.json({
        status: 'success',
        data: likes
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async getPostComments({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.getPostById, {
      data: { id: Number(params.id) }
    })

    // Get pagination parameters from query string
    const offset = request.input('offset', 0)
    const limit = request.input('limit', 5) // Default to 5 comments per page

    try {
      const result = await this.postsService.getPostComments(id, offset, limit)

      return response.json({
        status: 'success',
        data: result.comments,
        hasMore: result.hasMore
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async likePost({ request, response, params, auth }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.likePost, {
      data: { id: Number(params.id) }
    })

    try {
      // Try to get the authenticated user
      let userId;
      try {
        const user = await auth.authenticate();
        userId = user.id;
      } catch (authError) {
        // If authentication fails, check if user_id was provided in request
        userId = request.input('user_id');

        if (!userId) {
          return response.status(401).json({
            status: 'error',
            message: 'Authentication required to like a post'
          });
        }
      }

      const like = await this.postsService.likePost(id, userId)

      return response.status(201).json({
        status: 'success',
        data: like
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async unlikePost({ request, response, params, auth }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.unlikePost, {
      data: { id: Number(params.id) }
    })

    try {
      // Try to get the authenticated user
      let userId;
      try {
        const user = await auth.authenticate();
        userId = user.id;
      } catch (authError) {
        // If authentication fails, check if user_id was provided in request
        userId = request.input('user_id');

        if (!userId) {
          return response.status(401).json({
            status: 'error',
            message: 'Authentication required to unlike a post'
          });
        }
      }

      await this.postsService.unlikePost(id, userId)

      return response.json({
        status: 'success',
        message: 'Post unliked successfully'
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  // Add a new endpoint to check if a user has liked a post
  public async checkUserLiked({ request, response, params, auth }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.getPostById, {
      data: { id: Number(params.id) }
    })

    try {
      // Try to get the authenticated user
      let userId;
      try {
        const user = await auth.authenticate();
        userId = user.id;
      } catch (authError) {
        // If authentication fails, check if user_id was provided in request
        userId = request.input('user_id');

        if (!userId) {
          return response.status(401).json({
            status: 'error',
            message: 'Authentication required to check like status'
          });
        }
      }

      const like = await this.postsService.checkUserLiked(id, userId);

      return response.json({
        status: 'success',
        data: {
          liked: !!like
        }
      });
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }


}