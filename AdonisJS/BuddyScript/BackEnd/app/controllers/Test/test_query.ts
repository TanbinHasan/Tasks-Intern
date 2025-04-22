import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";

@inject()
export default class TestQuery {
  public async findById(id: number) {
    return db.from('temps').where('id', id);
  }

  public async findAll() {
    return db.from('temps').orderBy('id', 'asc');
  }
}