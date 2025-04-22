import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Users from './users.js'
import Posts from './posts.js'
import Replies from './replies.js'
import CommentLikes from './comment_likes.js'

export default class Comments extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare post_id: number

  @column()
  declare user_id: number

  @column()
  declare text: string

  @column()
  declare timestamp: number

  @column()
  declare created_at: Date

  @column()
  declare updated_at: Date

  @belongsTo(() => Users, {
    foreignKey: 'user_id'  // Explicitly define the foreign key
  })
  declare user: BelongsTo<typeof Users>

  @belongsTo(() => Posts, {
    foreignKey: 'post_id'  // Explicitly define the foreign key
  })
  declare post: BelongsTo<typeof Posts>

  @hasMany(() => Replies, {
    foreignKey: 'comment_id'  // Explicitly define the foreign key
  })
  declare replies: HasMany<typeof Replies>

  @hasMany(() => CommentLikes, {
    foreignKey: 'comment_id'  // Explicitly define the foreign key
  })
  declare likes: HasMany<typeof CommentLikes>
}