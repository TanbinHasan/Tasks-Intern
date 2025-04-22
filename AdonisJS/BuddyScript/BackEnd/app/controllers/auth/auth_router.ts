import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AuthController = () => import('./auth_controller.js')

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/is-logged-in', [AuthController, 'isLoggedIn']).use(middleware.auth())
    router.delete('/delete', [AuthController, 'deleteUser']).use(middleware.auth())
  })
  .prefix('api/auth')