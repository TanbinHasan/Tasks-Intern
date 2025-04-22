import { inject } from "@adonisjs/core";
import Replies from "#models/replies";
import ReplyLikes from "#models/reply_likes";

@inject()
export default class RepliesQuery {
  public async findById(id: number) {
    return Replies.find(id);
  }

  public async findByIdWithRelations(id: number) {
    return Replies.query()
      .where('id', id)
      .preload('user')
      .preload('comment')
      .preload('likes', (query) => {
        query.preload('user')
      })
      .first();
  }

  public async create(data: {
    comment_id: number,
    user_id: number,
    text: string,
    timestamp: number
  }) {
    return Replies.create(data);
  }

  public async update(id: number, data: {
    text: string
  }) {
    const reply = await Replies.find(id);
    if (!reply) return null;

    reply.merge(data);
    await reply.save();
    return reply;
  }

  public async delete(id: number) {
    const reply = await Replies.find(id);
    if (!reply) return false;

    await reply.delete();
    return true;
  }

  public async findReplyLikes(replyId: number) {
    return ReplyLikes.query().where('reply_id', replyId).orderBy('timestamp', 'desc');
  }

  public async findReplyLikeByUser(replyId: number, userId: number) {
    return ReplyLikes.query()
      .where({
        reply_id: replyId,
        user_id: userId
      })
      .first();
  }

  public async createReplyLike(data: {
    reply_id: number,
    user_id: number,
    timestamp: number
  }) {
    return ReplyLikes.create(data);
  }

  public async deleteReplyLike(replyId: number, userId: number) {
    const like = await this.findReplyLikeByUser(replyId, userId);
    if (!like) return false;

    await like.delete();
    return true;
  }
}