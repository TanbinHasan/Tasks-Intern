import { HttpContext } from "@adonisjs/core/http";
import { inject } from "@adonisjs/core";
import { usersValidator } from "./users_validator.js";
import UsersService from "./users_service.js";

@inject()
export default class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  public async getUserById({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(usersValidator.getUserById, {
      data: {id: Number(params.id)}
    })

    const user = await this.usersService.getUserById(id);

    return response.json({
      status: 'success',
      data: user
    })
  }

  public async getAllUsers({ request, response }: HttpContext) {
    await request.validateUsing(usersValidator.getAllUsers, {
      data: {}
    })

    const users = await this.usersService.getAllUsers()

    return response.json({
      status: 'success',
      data: users
    })
  }

  public async getUserPosts({ request, response, params, auth }: HttpContext) {
    const { id } = await request.validateUsing(usersValidator.getUserById, {
      data: {id: Number(params.id)}
    })
    
    try {
      const currentUser: any = auth.user?.id
      const posts = await this.usersService.getUserPosts(id, currentUser)
      
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

  public async getUserComments({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(usersValidator.getUserById, {
      data: {id: Number(params.id)}
    })
    
    try {
      const comments = await this.usersService.getUserComments(id)
      
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

  public async getUserReplies({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(usersValidator.getUserById, {
      data: {id: Number(params.id)}
    })
    
    try {
      const replies = await this.usersService.getUserReplies(id)
      
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
}