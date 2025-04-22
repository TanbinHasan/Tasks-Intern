import { inject } from "@adonisjs/core";
import MediaQuery from "./media_query.js";
import PostsQuery from "#controllers/Posts/posts_query";

@inject()
export default class MediaService {
  constructor(
    private mediaQuery: MediaQuery,
    private postsQuery: PostsQuery
  ) {}

  public async getMediaById(id: number) {
    const media = await this.mediaQuery.findById(id);

    if (!media) {
      const error = new Error('Media not found') as any;
      error.status = 404;
      throw error;
    }

    return media;
  }

  public async createMedia(data: {
    post_id: number,
    type: string,
    url: string
  }) {
    // Verify post exists first
    const post = await this.postsQuery.findById(data.post_id);
    
    if (!post) {
      const error = new Error('Post not found') as any;
      error.status = 404;
      throw error;
    }
    
    return this.mediaQuery.create(data);
  }

  public async updateMedia(id: number, data: {
    type?: string,
    url?: string
  }) {
    const media = await this.mediaQuery.findById(id);

    if (!media) {
      const error = new Error('Media not found') as any;
      error.status = 404;
      throw error;
    }

    const updatedMedia = await this.mediaQuery.update(id, data);
    return updatedMedia;
  }

  public async deleteMedia(id: number) {
    const media = await this.mediaQuery.findById(id);

    if (!media) {
      const error = new Error('Media not found') as any;
      error.status = 404;
      throw error;
    }

    const deleted = await this.mediaQuery.delete(id);
    return deleted;
  }
}