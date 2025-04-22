import User from '#models/users'

export default class AuthQuery {
  public async getUserByEmail(email: string) {
    return await User.findBy('email', email)
  }
  
  public async registerUser(name: string, email: string, password: string) {
    return await User.create({ name, email, password })
  }
  
  public async getVerifiedUser(email: string, password: string) {
    const user = await User.verifyCredentials(email, password)
    return user
  }
  
  public async deleteUser(id: number) {
    const user = await User.find(id)
    if (!user) return false
    
    await user.delete()
    return true
  }
}