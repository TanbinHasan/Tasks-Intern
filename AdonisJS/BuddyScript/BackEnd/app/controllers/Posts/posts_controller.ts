import { inject } from "@adonisjs/core";
import PostsService from "./posts_service.js";
import { HttpContext } from "@adonisjs/core/http";
import { postsValidator } from "./posts_validator.js";

@inject()
export default class PostsController {
  constructor(
    private postsService: PostsService
  ) {}

  public async getPostById({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.getPostById, {
      data: {id: Number(params.id)}
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

  public async getPostWithRelations({ request, response, params, auth }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.getPostById, {
      data: {id: Number(params.id)}
    })

    try {
      const post = await this.postsService.getPostWithRelations(id);
      
      // Check if the current user has liked this post
      let hasLiked = false;
      try {
        // Try to get the authenticated user
        const user = await auth.authenticate();
        // If authenticated, check if user has liked the post
        const like = await this.postsService.checkUserLiked(id, user.id);
        hasLiked = !!like;
      } catch (authError) {
        // If not authenticated, don't modify hasLiked
      }
      
      // Add the hasLiked property to the post
      const result = {
        ...post.toJSON(),
        isLikedByCurrentUser: hasLiked
      };

      return response.json({
        status: 'success',
        data: result
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
      data: {id: Number(params.id)}
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
      data: {id: Number(params.id)}
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
      data: {id: Number(params.id)}
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
      data: {id: Number(params.id)}
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
      data: {id: Number(params.id)}
    })
    
    try {
      const comments = await this.postsService.getPostComments(id)
      
      return response.json({
        status: 'success',
        data: comments
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
      data: {id: Number(params.id)}
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
      data: {id: Number(params.id)}
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
      data: {id: Number(params.id)}
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