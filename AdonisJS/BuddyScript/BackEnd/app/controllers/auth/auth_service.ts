import { Exception } from '@adonisjs/core/exceptions'
import AuthQuery from './auth_query.js'

export default class AuthService {
  private authQuery: AuthQuery
  constructor() {
    this.authQuery = new AuthQuery()
  }
  
  async registerUser(data: { name: string; email: string; password: string }) {
    const userAlreadyExist = await this.authQuery.getUserByEmail(data.email)
    if (userAlreadyExist) {
      throw new Exception('User already exist. Please choose a different email.', {
        status: 409,
        code: 'E_USER_ALREADY_EXIST',
      })
    }
    const user = await this.authQuery.registerUser(data.name, data.email, data.password)
    return user
  }
  
  async login(data: { email: string; password: string }) {
    const user = await this.authQuery.getVerifiedUser(data.email, data.password)
    return user
  }
  
  async deleteUser(id: number) {
    const deleted = await this.authQuery.deleteUser(id)
    
    if (!deleted) {
      throw new Exception('User not found', {
        status: 404,
      })
    }
    
    return true
  }
}