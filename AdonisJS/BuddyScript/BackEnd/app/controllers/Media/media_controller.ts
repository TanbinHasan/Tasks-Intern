import { inject } from "@adonisjs/core";
import MediaService from "./media_service.js";
import { HttpContext } from "@adonisjs/core/http";
import { mediaValidator } from "./media_validator.js";

@inject()
export default class MediaController {
  constructor(
    private mediaService: MediaService
  ) {}

  public async getMediaById({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(mediaValidator.getMediaById, {
      data: {id: Number(params.id)}
    })

    try {
      const media = await this.mediaService.getMediaById(id);

      return response.json({
        status: 'success',
        data: media
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async createMedia({ request, response }: HttpContext) {
    const data = await request.validateUsing(mediaValidator.createMedia)
    
    try {
      const media = await this.mediaService.createMedia(data)
      
      return response.status(201).json({
        status: 'success',
        data: media
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async updateMedia({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(mediaValidator.getMediaById, {
      data: {id: Number(params.id)}
    })
    
    const data = await request.validateUsing(mediaValidator.updateMedia)
    
    try {
      const media = await this.mediaService.updateMedia(id, data)
      
      return response.json({
        status: 'success',
        data: media
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async deleteMedia({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(mediaValidator.deleteMedia, {
      data: {id: Number(params.id)}
    })
    
    try {
      await this.mediaService.deleteMedia(id)
      
      return response.json({
        status: 'success',
        message: 'Media deleted successfully'
      })
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }
}