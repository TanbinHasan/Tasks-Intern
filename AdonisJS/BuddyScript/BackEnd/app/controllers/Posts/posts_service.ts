import { inject } from "@adonisjs/core";
import PostsQuery from "./posts_query.js";
import User from "#models/users";

@inject()
export default class PostsService {
  constructor(private postsQuery: PostsQuery) { }

  public async getPostById(id: number) {
    const post = await this.postsQuery.findById(id);

    if (!post) {
      const error = new Error('Post not found') as any;
      error.status = 404;
      throw error;
    }

    return post;
  }

  
  public async getAllPosts(page: number = 1, limit: number = 5) {
    return this.postsQuery.findAll(page, limit);
  }

  public async getPostsOrderedByLikes(page: number = 1, limit: number = 5) {
    return this.postsQuery.findAllOrderedByLikes(page, limit);
  }

  public async createPost(data: {
    user_id: number,
    text: string,
    timestamp: number
  }) {
    // Verify the user exists before creating the post
    const user = await User.find(data.user_id);

    if (!user) {
      const error = new Error(`User with ID ${data.user_id} not found`) as any;
      error.status = 404;
      throw error;
    }

    return this.postsQuery.create(data);
  }

  public async updatePost(id: number, userId: number, data: {
    text: string
  }) {
    const post = await this.postsQuery.findById(id);

    if (!post) {
      const error = new Error('Post not found') as any;
      error.status = 404;
      throw error;
    }

    if (post.user_id !== userId) {
      const error = new Error('You do not have permission to update this post') as any;
      error.status = 403;
      throw error;
    }

    const updatedPost = await this.postsQuery.update(id, data);
    return updatedPost;
  }

  public async deletePost(id: number, userId: number) {
    const post = await this.postsQuery.findById(id);

    if (!post) {
      const error = new Error('Post not found') as any;
      error.status = 404;
      throw error;
    }

    if (post.user_id !== userId) {
      const error = new Error('You do not have permission to delete this post') as any;
      error.status = 403;
      throw error;
    }

    const deleted = await this.postsQuery.delete(id);
    return deleted;
  }

  public async getPostMediaItems(id: number) {
    const post = await this.postsQuery.findById(id);

    if (!post) {
      const error = new Error('Post not found') as any;
      error.status = 404;
      throw error;
    }

    return this.postsQuery.findPostMediaItems(id);
  }

  public async getPostLikes(id: number) {
    const post = await this.postsQuery.findById(id);

    if (!post) {
      const error = new Error('Post not found') as any;
      error.status = 404;
      throw error;
    }

    return this.postsQuery.findPostLikes(id);
  }

  public async getPostComments(id: number, offset: number = 0, limit: number = 5) {
    const post = await this.postsQuery.findById(id);

    if (!post) {
      const error = new Error('Post not found') as any;
      error.status = 404;
      throw error;
    }

    // Get total comment count first
    const totalComments = await this.postsQuery.countPostComments(id);

    // Get paginated comments
    const comments = await this.postsQuery.findPostCommentsPaginated(id, offset, limit);

    // Determine if there are more comments to load
    const hasMore = offset + comments.length < totalComments;

    return {
      comments,
      hasMore
    };
  }

  public async getUserPosts(userId: number) {
    return this.postsQuery.findUserPosts(userId);
  }

  public async likePost(id: number, userId: number) {
    const post = await this.postsQuery.findById(id);

    if (!post) {
      const error = new Error('Post not found') as any;
      error.status = 404;
      throw error;
    }

    const existingLike = await this.postsQuery.findPostLikeByUser(id, userId);
    if (existingLike) {
      const error = new Error('You already liked this post') as any;
      error.status = 400;
      throw error;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    return this.postsQuery.createPostLike({
      post_id: id,
      user_id: userId,
      timestamp
    });
  }

  public async unlikePost(id: number, userId: number) {
    const post = await this.postsQuery.findById(id);

    if (!post) {
      const error = new Error('Post not found') as any;
      error.status = 404;
      throw error;
    }

    const existingLike = await this.postsQuery.findPostLikeByUser(id, userId);

    if (!existingLike) {
      const error = new Error('You have not liked this post') as any;
      error.status = 400;
      throw error;
    }

    const deleted = await this.postsQuery.deletePostLike(id, userId);
    return deleted;
  }

  // Add a new method to check if a user has liked a post
  public async checkUserLiked(postId: number, userId: number) {
    return this.postsQuery.findPostLikeByUser(postId, userId);
  }

}