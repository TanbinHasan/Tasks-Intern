import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Users from './users.js'
import Replies from './replies.js'

export default class ReplyLikes extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare reply_id: number

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

  @belongsTo(() => Replies, {
    foreignKey: 'reply_id'
  })
  declare reply: BelongsTo<typeof Replies>
}