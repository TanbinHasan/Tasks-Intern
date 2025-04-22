import router from "@adonisjs/core/services/router";

const UsersController = () => import('./users_controller.js')

// All routes are public now
router.group(() => {
  router.get('/users/:id', [UsersController, 'getUserById'])
  router.get('/users', [UsersController, 'getAllUsers'])
  router.get('/users/:id/posts', [UsersController, 'getUserPosts'])
  router.get('/users/:id/comments', [UsersController, 'getUserComments'])
  router.get('/users/:id/replies', [UsersController, 'getUserReplies'])
}).prefix('/api')