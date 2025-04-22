import { inject } from "@adonisjs/core";
import TestQuery from "./test_query.js";

@inject()
export default class TestService {
  constructor(private testQuery: TestQuery) {}

  public async getUserById(id: number) {
    const user = await this.testQuery.findById(id);
    
    if (!user) {
      const error = new Error('User not found') as any;
      error.status = 404;
      throw error;
    }
    
    return user;
  }

  public async getAllUsers() {
    return this.testQuery.findAll();
  }
}