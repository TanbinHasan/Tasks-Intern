import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Posts from './posts.js'

export default class MediaItems extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare post_id: number

  @column()
  declare type: string

  @column()
  declare url: string

  @column()
  declare created_at: Date

  @column()
  declare updated_at: Date

  @belongsTo(() => Posts)
  declare post: BelongsTo<typeof Posts>
}