import Comments from "#models/comments";
import MediaItems from "#models/media_items";
import PostLikes from "#models/post_likes";
import Posts from "#models/posts";
import { inject } from "@adonisjs/core";

@inject()
export default class PostsQuery {
  public async findById(id: number) {
    return Posts.find(id);
  }

  public async findByIdWithRelations(id: number) {
    return Posts.query()
      .where('id', id)
      .preload('user')
      .preload('mediaItems')
      .preload('comments', (query) => {
        query
          .orderBy('timestamp', 'desc')
          .preload('user')
          .preload('likes', (likesQuery) => {
            likesQuery.preload('user');
          })
          .preload('replies', (repliesQuery) => {
            repliesQuery
              .orderBy('timestamp', 'desc')
              .preload('user')
              .preload('likes', (replyLikesQuery) => {
                replyLikesQuery.preload('user');
              });
          });
      })
      .preload('likes', (query) => {
        query.preload('user');
      })
      .first();
  }

  // In posts_query.ts, update the findAll method:
  public async findAll(page: number = 1, limit: number = 5) {
    // Calculate the offset based on page and limit
    const offset = (page - 1) * limit;

    // Using the offset approach for pagination to ensure compatibility
    const posts = await Posts.query()
      .preload('user')
      .preload('mediaItems')
      .preload('comments', (query) => {
        query
          .orderBy('timestamp', 'desc')
          .preload('user')
          .preload('likes', (likesQuery) => {
            likesQuery.preload('user');
          })
          .preload('replies', (repliesQuery) => {
            repliesQuery
              .orderBy('timestamp', 'desc')
              .preload('user')
              .preload('likes', (replyLikesQuery) => {
                replyLikesQuery.preload('user');
              });
          });
      })
      .preload('likes', (query) => {
        query.preload('user');
      })
      .withCount('comments')
      .orderBy('timestamp', 'desc')
      .offset(offset)
      .limit(limit);

    return posts;
  }

  public async create(data: {
    user_id: number,
    text: string,
    timestamp: number
  }) {
    return Posts.create(data);
  }

  public async update(id: number, data: {
    text: string
  }) {
    const post = await Posts.find(id);
    if (!post) return null;

    post.merge(data);
    await post.save();
    return post;
  }

  public async delete(id: number) {
    const post = await Posts.find(id);
    if (!post) return false;

    await post.delete();
    return true;
  }

  public async findPostMediaItems(postId: number) {
    return MediaItems.query().where('post_id', postId);
  }

  public async findPostLikes(postId: number) {
    return PostLikes.query().where('post_id', postId).orderBy('timestamp', 'desc');
  }

  public async findPostComments(postId: number) {
    return Comments.query()
      .where('post_id', postId)
      .orderBy('timestamp', 'desc')
      .preload('user')
      .preload('replies', (query) => {
        query
          .orderBy('timestamp', 'desc')
          .preload('user')
          .preload('likes');
      })
      .preload('likes');
  }

  public async findUserPosts(userId: number) {
    return Posts.query().where('user_id', userId).orderBy('timestamp', 'desc');
  }

  public async findPostLikeByUser(postId: number, userId: number) {
    return PostLikes.query()
      .where({
        post_id: postId,
        user_id: userId
      })
      .first();
  }

  public async createPostLike(data: {
    post_id: number,
    user_id: number,
    timestamp: number
  }) {
    return PostLikes.create(data);
  }

  public async deletePostLike(postId: number, userId: number) {
    const like = await this.findPostLikeByUser(postId, userId);
    if (!like) return false;

    await like.delete();
    return true;
  }

  public async findByIdWithUser(id: number) {
    return Posts.query()
      .where('id', id)
      .preload('user')
      .first();
  }
}