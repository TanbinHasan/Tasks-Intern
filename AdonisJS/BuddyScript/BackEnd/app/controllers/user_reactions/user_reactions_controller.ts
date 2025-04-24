import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import UserReactionsService from "./user_reactions_service.js";

@inject()
export default class UserReactionsController {
  constructor(
    private userReactionsService: UserReactionsService
  ) {}

  /**
   * Get all reactions for the authenticated user
   */
  public async getUserReactions({ response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate();
      const reactions = await this.userReactionsService.getUserReactions(user.id);
      
      return response.json({
        status: 'success',
        data: reactions
      });
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Get post reactions for the authenticated user
   */
  public async getPostReactions({ response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate();
      const reactions = await this.userReactionsService.getPostReactions(user.id);
      
      return response.json({
        status: 'success',
        data: reactions
      });
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Get comment reactions for the authenticated user
   */
  public async getCommentReactions({ response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate();
      const reactions = await this.userReactionsService.getCommentReactions(user.id);
      
      return response.json({
        status: 'success',
        data: reactions
      });
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Get reply reactions for the authenticated user
   */
  public async getReplyReactions({ response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate();
      const reactions = await this.userReactionsService.getReplyReactions(user.id);
      
      return response.json({
        status: 'success',
        data: reactions
      });
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}