import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Users from './users.js'
import Comments from './comments.js'
import ReplyLikes from './reply_likes.js'

export default class Replies extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare comment_id: number

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
    foreignKey: 'user_id'
  })
  declare user: BelongsTo<typeof Users>

  @belongsTo(() => Comments, {
    foreignKey: 'comment_id'
  })
  declare comment: BelongsTo<typeof Comments>

  @hasMany(() => ReplyLikes, {
    foreignKey: 'reply_id'
  })
  declare likes: HasMany<typeof ReplyLikes>
}