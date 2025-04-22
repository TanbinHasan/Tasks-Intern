import { inject } from "@adonisjs/core";
import CommentsService from "./comments_service.js";
import { HttpContext } from "@adonisjs/core/http";
import { commentsValidator } from "./comments_validator.js";

@inject()
export default class CommentsController {
  constructor(
    private commentsService: CommentsService
  ) {}

  public async getCommentById({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(commentsValidator.getCommentById, {
      data: {id: Number(params.id)}
    })

    try {
      const comment = await this.commentsService.getCommentById(id);

      return response.json({
        status: 'success',
        data: comment
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async getCommentWithRelations({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(commentsValidator.getCommentById, {
      data: {id: Number(params.id)}
    })

    try {
      const comment = await this.commentsService.getCommentWithRelations(id);

      return response.json({
        status: 'success',
        data: comment
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async createComment({ request, response }: HttpContext) {
    const data = await request.validateUsing(commentsValidator.createComment)
    
    try {
      const commentData = {
        ...data,
        user_id: request.input('user_id', 1), // Default to user_id 1 if not provided
        timestamp: Math.floor(Date.now() / 1000)
      }
      
      const comment = await this.commentsService.createComment(commentData)
      
      return response.status(201).json({
        status: 'success',
        data: comment
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async updateComment({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(commentsValidator.getCommentById, {
      data: {id: Number(params.id)}
    })
    
    const data = await request.validateUsing(commentsValidator.updateComment)
    
    try {
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
      const comment = await this.commentsService.updateComment(id, userId, data)
      
      return response.json({
        status: 'success',
        data: comment
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async deleteComment({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(commentsValidator.deleteComment, {
      data: {id: Number(params.id)}
    })
    
    try {
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
      await this.commentsService.deleteComment(id, userId)
      
      return response.json({
        status: 'success',
        message: 'Comment deleted successfully'
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async getCommentReplies({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(commentsValidator.getCommentById, {
      data: {id: Number(params.id)}
    })
    
    try {
      const replies = await this.commentsService.getCommentReplies(id)
      
      return response.json({
        status: 'success',
        data: replies
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async likeComment({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(commentsValidator.likeComment, {
      data: {id: Number(params.id)}
    })
    
    try {
      // Get user_id from request instead of auth
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
      const like = await this.commentsService.likeComment(id, userId)
      
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

  public async unlikeComment({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(commentsValidator.unlikeComment, {
      data: {id: Number(params.id)}
    })
    
    try {
      // Get user_id from request instead of auth
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
      await this.commentsService.unlikeComment(id, userId)
      
      return response.json({
        status: 'success',
        message: 'Comment unliked successfully'
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }
}