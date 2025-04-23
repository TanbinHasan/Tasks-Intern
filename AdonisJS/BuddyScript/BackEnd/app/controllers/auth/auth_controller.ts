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
    console.log({ payload })
    const user = await this.userService.registerUser(payload)
    return response.send(user)
  }
  
  public async login({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(LoginValidator)
    try {
      const user = await this.userService.login(payload)

      // Log the user in with the web guard
      await auth.use('web').login(user)

      // Return user data
      return response.json(auth.use('web').user)
    } catch (error: any) {
      return response.status(401).json({
        status: 'error',
        message: error.message || 'Invalid credentials'
      })
    }
  }
  
  public async isLoggedIn({ auth, response }: HttpContext) {
    try {
      // Check if user is authenticated
      const isAuthenticated = await auth.use('web').check()
      
      if (!isAuthenticated) {
        // Return null for unauthorized access
        return response.status(401).json(null)
      }
      
      // If authenticated, return the user
      return response.json(auth.use('web').user)
    } catch (error) {
      console.log('Authentication error:', error.message)
      return response.status(401).json(null)
    }
  }
  
  public async logout({ auth, response }: HttpContext) {
    try {
      // Logout the user
      await auth.use('web').logout()
      
      // Clear cookies
      response.clearCookie('adonis-session')
      response.clearCookie('adonis-session-values')
      
      return response.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
      })
    } catch (error) {
      console.error('Logout error:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Failed to logout'
      })
    }
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