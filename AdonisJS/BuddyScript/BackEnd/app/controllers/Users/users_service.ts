import { inject } from "@adonisjs/core";
import UsersQuery from "./users_query.js";

@inject()
export default class UsersService {
  constructor(private usersQuery: UsersQuery) {}

  public async getUserById(id: number) {
    const user = await this.usersQuery.findById(id);
    if (!user) {
      const error = new Error('User not found') as any;
      error.status = 404;
      throw error;
    }
    return user;
  }

  public async getAllUsers() {
    return this.usersQuery.findAll();
  }

  public async getUserPosts(id: number, currentUser: number) {
    if (id !== currentUser) {
      const error = new Error('Access denied') as any;
      error.status = 403;
      throw error;
    }

    const user = await this.usersQuery.findById(id);
    
    if (!user) {
      const error = new Error('User not found') as any;
      error.status = 404;
      throw error;
    }
    
    // Use the query method from UsersQuery
    return this.usersQuery.findUserPosts(id);
  }

  public async getUserComments(id: number) {
    // First verify the user exists
    const user = await this.usersQuery.findById(id);
    
    if (!user) {
      const error = new Error('User not found') as any;
      error.status = 404;
      throw error;
    }
    
    // Use the query method from UsersQuery
    return this.usersQuery.findUserComments(id);
  }

  public async getUserReplies(id: number) {
    // First verify the user exists
    const user = await this.usersQuery.findById(id);
    
    if (!user) {
      const error = new Error('User not found') as any;
      error.status = 404;
      throw error;
    }
    
    // Use the query method from UsersQuery
    return this.usersQuery.findUserReplies(id);
  }
}