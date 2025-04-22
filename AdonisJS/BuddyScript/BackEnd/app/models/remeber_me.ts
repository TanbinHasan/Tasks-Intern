import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import string  from '@adonisjs/core/helpers/string'
import Users from './users.js'

export default class RememberMe extends BaseModel {
  static table = 'remember_me'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare token: string

  @column()
  declare expires_at: Date | null

  @column()
  declare created_at: Date

  @column()
  declare updated_at: Date

  @belongsTo(() => Users, {
    foreignKey: 'user_id'
  })
  declare user: BelongsTo<typeof Users>

  @beforeCreate()
  static assignToken(rememberMe: RememberMe) {
    rememberMe.token = string.generateRandom(64)
  }
}