import { inject } from "@adonisjs/core";
import MediaItems from "#models/media_items";

@inject()
export default class MediaQuery {
  public async findById(id: number) {
    return MediaItems.find(id);
  }

  public async findByIdWithPost(id: number) {
    return MediaItems.query()
      .where('id', id)
      .preload('post')
      .first();
  }

  public async create(data: {
    post_id: number,
    type: string,
    url: string
  }) {
    return MediaItems.create(data);
  }

  public async update(id: number, data: {
    type?: string,
    url?: string
  }) {
    const media = await MediaItems.find(id);
    if (!media) return null;

    media.merge(data);
    await media.save();
    return media;
  }

  public async delete(id: number) {
    const media = await MediaItems.find(id);
    if (!media) return false;

    await media.delete();
    return true;
  }

  public async findPostMedia(postId: number) {
    return MediaItems.query().where('post_id', postId);
  }
}