import { inject } from "@adonisjs/core";
import PostLikes from "#models/post_likes";
import CommentLikes from "#models/comment_likes";
import ReplyLikes from "#models/reply_likes";

@inject()
export default class UserReactionsQuery {
  /**
   * Find all post reactions by a specific user
   */
  public async findPostReactionsByUser(userId: number) {
    return PostLikes.query()
      .where('user_id', userId)
      .orderBy('timestamp', 'desc');
  }

  /**
   * Find all comment reactions by a specific user
   */
  public async findCommentReactionsByUser(userId: number) {
    return CommentLikes.query()
      .where('user_id', userId)
      .orderBy('timestamp', 'desc');
  }

  /**
   * Find all reply reactions by a specific user
   */
  public async findReplyReactionsByUser(userId: number) {
    return ReplyLikes.query()
      .where('user_id', userId)
      .orderBy('timestamp', 'desc');
  }
}