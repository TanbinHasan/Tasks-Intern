import router from "@adonisjs/core/services/router";

const PostsController = () => import('./posts_controller.js')

router.group(() => {
  router.get('/posts/:id', [PostsController, 'getPostById'])
  router.get('/posts/:id/full', [PostsController, 'getPostWithRelations'])
  router.get('/posts', [PostsController, 'getAllPosts'])
  router.get('/posts/:id/comments', [PostsController, 'getPostComments'])
  router.get('/posts/:id/media', [PostsController, 'getPostMediaItems'])
  router.get('/posts/:id/likes', [PostsController, 'getPostLikes'])
  
  // Add a new route to check if a user has liked a post
  router.get('/posts/:id/like', [PostsController, 'checkUserLiked'])
  
  router.post('/posts', [PostsController, 'createPost'])
  router.put('/posts/:id', [PostsController, 'updatePost'])
  router.delete('/posts/:id', [PostsController, 'deletePost'])
  
  router.post('/posts/:id/like', [PostsController, 'likePost'])
  router.delete('/posts/:id/like', [PostsController, 'unlikePost'])
}).prefix('/api')