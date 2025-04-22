import { inject } from "@adonisjs/core";
import Comments from "#models/comments";
import Replies from "#models/replies";
import CommentLikes from "#models/comment_likes";

@inject()
export default class CommentsQuery {
  public async findById(id: number) {
    return Comments.find(id);
  }

  public async findByIdWithRelations(id: number) {
    return Comments.query()
      .where('id', id)
      .preload('user')
      .preload('post')
      .preload('replies', (query) => {
        query.orderBy('timestamp', 'desc').preload('user')
      })
      .preload('likes', (query) => {
        query.preload('user')
      })
      .first();
  }

  public async create(data: {
    post_id: number,
    user_id: number,
    text: string,
    timestamp: number
  }) {
    return Comments.create(data);
  }

  public async update(id: number, data: {
    text: string
  }) {
    const comment = await Comments.find(id);
    if (!comment) return null;

    comment.merge(data);
    await comment.save();
    return comment;
  }

  public async delete(id: number) {
    const comment = await Comments.find(id);
    if (!comment) return false;

    await comment.delete();
    return true;
  }

  public async findCommentReplies(commentId: number) {
    return Replies.query().where('comment_id', commentId).orderBy('timestamp', 'desc');
  }

  public async findCommentLikes(commentId: number) {
    return CommentLikes.query().where('comment_id', commentId).orderBy('timestamp', 'desc');
  }

  public async findCommentLikeByUser(commentId: number, userId: number) {
    return CommentLikes.query()
      .where({
        comment_id: commentId,
        user_id: userId
      })
      .first();
  }

  public async createCommentLike(data: {
    comment_id: number,
    user_id: number,
    timestamp: number
  }) {
    return CommentLikes.create(data);
  }

  public async deleteCommentLike(commentId: number, userId: number) {
    const like = await this.findCommentLikeByUser(commentId, userId);
    if (!like) return false;

    await like.delete();
    return true;
  }
}