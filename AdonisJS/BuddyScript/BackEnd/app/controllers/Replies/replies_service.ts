import { inject } from "@adonisjs/core";
import RepliesQuery from "./replies_query.js";

@inject()
export default class RepliesService {
  constructor(private repliesQuery: RepliesQuery) {}

  public async getReplyById(id: number) {
    const reply = await this.repliesQuery.findById(id);

    if (!reply) {
      const error = new Error('Reply not found') as any;
      error.status = 404;
      throw error;
    }

    return reply;
  }

  public async getReplyWithRelations(id: number) {
    const reply = await this.repliesQuery.findByIdWithRelations(id);
    
    if (!reply) {
      const error = new Error('Reply not found') as any;
      error.status = 404;
      throw error;
    }
    
    return reply;
  }

  public async createReply(data: {
    comment_id: number,
    user_id: number,
    text: string,
    timestamp: number
  }) {
    return this.repliesQuery.create(data);
  }

  public async updateReply(id: number, userId: number, data: {
    text: string
  }) {
    const reply = await this.repliesQuery.findById(id);

    if (!reply) {
      const error = new Error('Reply not found') as any;
      error.status = 404;
      throw error;
    }

    if (reply.user_id !== userId) {
      const error = new Error('You do not have permission to update this reply') as any;
      error.status = 403;
      throw error;
    }

    const updatedReply = await this.repliesQuery.update(id, data);
    return updatedReply;
  }

  public async deleteReply(id: number, userId: number) {
    const reply = await this.repliesQuery.findById(id);

    if (!reply) {
      const error = new Error('Reply not found') as any;
      error.status = 404;
      throw error;
    }

    if (reply.user_id !== userId) {
      const error = new Error('You do not have permission to delete this reply') as any;
      error.status = 403;
      throw error;
    }

    const deleted = await this.repliesQuery.delete(id);
    return deleted;
  }

  public async likeReply(id: number, userId: number) {
    const reply = await this.repliesQuery.findById(id);
    
    if (!reply) {
      const error = new Error('Reply not found') as any;
      error.status = 404;
      throw error;
    }

    const existingLike = await this.repliesQuery.findReplyLikeByUser(id, userId);
    if (existingLike) {
      const error = new Error('You already liked this reply') as any;
      error.status = 400;
      throw error;
    }
    
    const timestamp = Math.floor(Date.now() / 1000);
    return this.repliesQuery.createReplyLike({
      reply_id: id,
      user_id: userId,
      timestamp
    });
  }

  public async unlikeReply(id: number, userId: number) {
    const reply = await this.repliesQuery.findById(id);

    if (!reply) {
      const error = new Error('Reply not found') as any;
      error.status = 404;
      throw error;
    }
    
    const existingLike = await this.repliesQuery.findReplyLikeByUser(id, userId);

    if (!existingLike) {
      const error = new Error('You have not liked this reply') as any;
      error.status = 400;
      throw error;
    }
    
    const deleted = await this.repliesQuery.deleteReplyLike(id, userId);
    return deleted;
  }
}