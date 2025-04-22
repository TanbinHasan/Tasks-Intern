import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Posts from './posts.js'
import Comments from './comments.js'
import Replies from './replies.js'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'], //finding a user by a UID(email) and verifying their password before marking them as logged in.
  passwordColumnName: 'password',
})

export default class Users extends compose(BaseModel, AuthFinder) {
  serializeExtras = true
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare created_at: Date

  @column()
  declare updated_at: Date

  @hasMany(() => Posts)
  declare posts: HasMany<typeof Posts>

  @hasMany(() => Comments)
  declare comments: HasMany<typeof Comments>

  @hasMany(() => Replies)
  declare replies: HasMany<typeof Replies>
}