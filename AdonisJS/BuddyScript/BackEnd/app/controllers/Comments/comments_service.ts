import { inject } from "@adonisjs/core";
import CommentsQuery from "./comments_query.js";

@inject()
export default class CommentsService {
  constructor(private commentsQuery: CommentsQuery) {}

  public async getCommentById(id: number) {
    const comment = await this.commentsQuery.findById(id);

    if (!comment) {
      const error = new Error('Comment not found') as any;
      error.status = 404;
      throw error;
    }

    return comment;
  }

  public async getCommentWithRelations(id: number) {
    const comment = await this.commentsQuery.findByIdWithRelations(id);
    
    if (!comment) {
      const error = new Error('Comment not found') as any;
      error.status = 404;
      throw error;
    }
    
    return comment;
  }

  public async createComment(data: {
    post_id: number,
    user_id: number,
    text: string,
    timestamp: number
  }) {
    return this.commentsQuery.create(data);
  }

  public async updateComment(id: number, userId: number, data: {
    text: string
  }) {
    const comment = await this.commentsQuery.findById(id);

    if (!comment) {
      const error = new Error('Comment not found') as any;
      error.status = 404;
      throw error;
    }

    if (comment.user_id !== userId) {
      const error = new Error('You do not have permission to update this comment') as any;
      error.status = 403;
      throw error;
    }

    const updatedComment = await this.commentsQuery.update(id, data);
    return updatedComment;
  }

  public async deleteComment(id: number, userId: number) {
    const comment = await this.commentsQuery.findById(id);

    if (!comment) {
      const error = new Error('Comment not found') as any;
      error.status = 404;
      throw error;
    }

    if (comment.user_id !== userId) {
      const error = new Error('You do not have permission to delete this comment') as any;
      error.status = 403;
      throw error;
    }

    const deleted = await this.commentsQuery.delete(id);
    return deleted;
  }

  public async getCommentReplies(id: number) {
    const comment = await this.commentsQuery.findById(id);

    if (!comment) {
      const error = new Error('Comment not found') as any;
      error.status = 404;
      throw error;
    }

    return this.commentsQuery.findCommentReplies(id);
  }

  public async likeComment(id: number, userId: number) {
    const comment = await this.commentsQuery.findById(id);
    
    if (!comment) {
      const error = new Error('Comment not found') as any;
      error.status = 404;
      throw error;
    }

    const existingLike = await this.commentsQuery.findCommentLikeByUser(id, userId);
    if (existingLike) {
      const error = new Error('You already liked this comment') as any;
      error.status = 400;
      throw error;
    }
    
    const timestamp = Math.floor(Date.now() / 1000);
    return this.commentsQuery.createCommentLike({
      comment_id: id,
      user_id: userId,
      timestamp
    });
  }

  public async unlikeComment(id: number, userId: number) {
    const comment = await this.commentsQuery.findById(id);

    if (!comment) {
      const error = new Error('Comment not found') as any;
      error.status = 404;
      throw error;
    }
    
    const existingLike = await this.commentsQuery.findCommentLikeByUser(id, userId);

    if (!existingLike) {
      const error = new Error('You have not liked this comment') as any;
      error.status = 400;
      throw error;
    }
    
    const deleted = await this.commentsQuery.deleteCommentLike(id, userId);
    return deleted;
  }
}