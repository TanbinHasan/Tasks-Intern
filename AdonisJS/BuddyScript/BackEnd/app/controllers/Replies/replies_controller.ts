import { inject } from "@adonisjs/core";
import RepliesService from "./replies_service.js";
import { HttpContext } from "@adonisjs/core/http";
import { repliesValidator } from "./replies_validator.js";

@inject()
export default class RepliesController {
  constructor(
    private repliesService: RepliesService
  ) {}

  public async getReplyById({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(repliesValidator.getReplyById, {
      data: {id: Number(params.id)}
    })

    try {
      const reply = await this.repliesService.getReplyById(id);

      return response.json({
        status: 'success',
        data: reply
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async getReplyWithRelations({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(repliesValidator.getReplyById, {
      data: {id: Number(params.id)}
    })

    try {
      const reply = await this.repliesService.getReplyWithRelations(id);

      return response.json({
        status: 'success',
        data: reply
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async createReply({ request, response }: HttpContext) {
    const data = await request.validateUsing(repliesValidator.createReply)
    
    try {
      const replyData = {
        ...data,
        user_id: request.input('user_id', 1), // Default to user_id 1 if not provided
        timestamp: Math.floor(Date.now() / 1000)
      }
      
      const reply = await this.repliesService.createReply(replyData)
      
      return response.status(201).json({
        status: 'success',
        data: reply
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async updateReply({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(repliesValidator.getReplyById, {
      data: {id: Number(params.id)}
    })
    
    const data = await request.validateUsing(repliesValidator.updateReply)
    
    try {
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
      const reply = await this.repliesService.updateReply(id, userId, data)
      
      return response.json({
        status: 'success',
        data: reply
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async deleteReply({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(repliesValidator.deleteReply, {
      data: {id: Number(params.id)}
    })
    
    try {
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
      await this.repliesService.deleteReply(id, userId)
      
      return response.json({
        status: 'success',
        message: 'Reply deleted successfully'
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async likeReply({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(repliesValidator.likeReply, {
      data: {id: Number(params.id)}
    })
    
    try {
      // Get user_id from request instead of auth
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
      const like = await this.repliesService.likeReply(id, userId)
      
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

  public async unlikeReply({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(repliesValidator.unlikeReply, {
      data: {id: Number(params.id)}
    })
    
    try {
      // Get user_id from request instead of auth
      const userId = request.input('user_id', 1) // Default to user_id 1 if not provided
      await this.repliesService.unlikeReply(id, userId)
      
      return response.json({
        status: 'success',
        message: 'Reply unliked successfully'
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }
}