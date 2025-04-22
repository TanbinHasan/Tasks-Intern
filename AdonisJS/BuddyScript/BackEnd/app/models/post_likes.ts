import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Users from './users.js'
import Posts from './posts.js'

export default class PostLikes extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare post_id: number

  @column()
  declare user_id: number

  @column()
  declare timestamp: number

  @column()
  declare created_at: Date

  static get updatedAtColumn() {
    return null
  }

  @belongsTo(() => Users, {
    foreignKey: 'user_id'
  })
  declare user: BelongsTo<typeof Users>

  @belongsTo(() => Posts, {
    foreignKey: 'post_id'
  })
  declare post: BelongsTo<typeof Posts>
}