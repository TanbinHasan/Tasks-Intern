import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Users from './users.js'
import MediaItems from './media_items.js'
import Comments from './comments.js'
import PostLikes from './post_likes.js'

export default class Posts extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

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
    foreignKey: 'user_id',
    localKey: 'id' // Explicitly define the local key
  })
  declare user: BelongsTo<typeof Users>

  @hasMany(() => MediaItems, {
    foreignKey: 'post_id',
  })
  declare mediaItems: HasMany<typeof MediaItems>

  @hasMany(() => Comments, {
    foreignKey: 'post_id',
  })
  declare comments: HasMany<typeof Comments>

  @hasMany(() => PostLikes, {
    foreignKey: 'post_id',
  })
  declare likes: HasMany<typeof PostLikes>
  content: any
  userId: any
}