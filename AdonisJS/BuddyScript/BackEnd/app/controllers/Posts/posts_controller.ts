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

  public async getPostWithRelations({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.getPostById, {
      data: {id: Number(params.id)}
    })

    try {
      const post = await this.postsService.getPostWithRelations(id);

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

  public async getAllPosts({ request, response }: HttpContext) {
    await request.validateUsing(postsValidator.getAllPosts, {
      data: {}
    })

    try {
      const posts = await this.postsService.getAllPosts()

      return response.json({
        status: 'success',
        data: posts
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async createPost({ request, response }: HttpContext) {
    const data = await request.validateUsing(postsValidator.createPost)
    
    try {
      const postData = {
        ...data,
        user_id: request.input('user_id', 1), // Default to user_id 1 if not provided
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

  public async updatePost({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.getPostById, {
      data: {id: Number(params.id)}
    })
    
    const data = await request.validateUsing(postsValidator.updatePost)
    
    try {
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
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

  public async deletePost({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.deletePost, {
      data: {id: Number(params.id)}
    })
    
    try {
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
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

  public async likePost({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.likePost, {
      data: {id: Number(params.id)}
    })
    
    try {
      // Get user_id from request instead of auth
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
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

  public async unlikePost({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(postsValidator.unlikePost, {
      data: {id: Number(params.id)}
    })
    
    try {
      // Get user_id from request instead of auth
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
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
}