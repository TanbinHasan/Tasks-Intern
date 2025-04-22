import { LoginValidator, RegisterValidator } from './auth_validator.js'
import AuthService from './auth_service.js'
import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'

export default class AuthController {
  private userService: AuthService
  constructor() {
    this.userService = new AuthService()
  }
  
  public async register({ response, request }: HttpContext) {
    const payload = await request.validateUsing(RegisterValidator)
    console.log({payload})
    const user = await this.userService.registerUser(payload)
    return response.send(user)
  }
  
  public async login({ auth, request }: HttpContext) {
    const payload = await request.validateUsing(LoginValidator)
    const user = await this.userService.login(payload)
    await auth.use('web').login(user)
    return auth.use('web').user
  }
  
  public async isLoggedIn({ auth }: HttpContext) {
    try {
      const user = await auth.use('web').authenticate()
      return user
    } catch {
      return null
    }
  }
  
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.send({ message: 'Logged out successfully' })
  }
  
  public async deleteUser({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const deleted = await this.userService.deleteUser(user.id)
      
      if (deleted) {
        await auth.use('web').logout()
        return response.send({ message: 'User deleted successfully' })
      } else {
        throw new Exception('Failed to delete user', { status: 500 })
      }
    } catch (error: any) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message
      })
    }
  }
}