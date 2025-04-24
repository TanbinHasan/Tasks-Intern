import { inject } from "@adonisjs/core";
import UserReactionsQuery from "./user_reactions_query.js";

@inject()
export default class UserReactionsService {
  constructor(
    private userReactionsQuery: UserReactionsQuery
  ) {}

  /**
   * Get all reactions for a user by user ID
   */
  public async getUserReactions(userId: number) {
    // Get all types of reactions
    const postReactions = await this.getPostReactions(userId);
    const commentReactions = await this.getCommentReactions(userId);
    const replyReactions = await this.getReplyReactions(userId);

    return {
      posts: postReactions,
      comments: commentReactions,
      replies: replyReactions
    };
  }

  /**
   * Get all post reactions for a user by user ID
   */
  public async getPostReactions(userId: number) {
    const reactions = await this.userReactionsQuery.findPostReactionsByUser(userId);
    
    // Transform to a format easier to use in the frontend
    return reactions.map(reaction => ({
      id: reaction.post_id,
      type: 'post'
    }));
  }

  /**
   * Get all comment reactions for a user by user ID
   */
  public async getCommentReactions(userId: number) {
    const reactions = await this.userReactionsQuery.findCommentReactionsByUser(userId);
    
    // Transform to a format easier to use in the frontend
    return reactions.map(reaction => ({
      id: reaction.comment_id,
      type: 'comment'
    }));
  }

  /**
   * Get all reply reactions for a user by user ID
   */
  public async getReplyReactions(userId: number) {
    const reactions = await this.userReactionsQuery.findReplyReactionsByUser(userId);
    
    // Transform to a format easier to use in the frontend
    return reactions.map(reaction => ({
      id: reaction.reply_id,
      type: 'reply'
    }));
  }
}