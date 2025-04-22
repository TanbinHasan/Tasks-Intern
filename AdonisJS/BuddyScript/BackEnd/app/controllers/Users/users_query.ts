import { inject } from "@adonisjs/core";
import Users from "#models/users";
import Posts from "#models/posts";
import Comments from "#models/comments";
import Replies from "#models/replies";

@inject()
export default class UsersQuery {
  public async findById(id: number) {
    return Users.find(id);
  }

  public async findAll() {
    return Users.query().orderBy('id', 'asc');
  }
  
  public async findByEmail(email: string) {
    return Users.findBy('email', email);
  }
  
  public async findUserPosts(userId: number) {
    return Posts.query().where('user_id', userId).orderBy('timestamp', 'desc');
  }
  
  public async findUserComments(userId: number) {
    return Comments.query().where('user_id', userId).orderBy('timestamp', 'desc');
  }
  
  public async findUserReplies(userId: number) {
    return Replies.query().where('user_id', userId).orderBy('timestamp', 'desc');
  }
}