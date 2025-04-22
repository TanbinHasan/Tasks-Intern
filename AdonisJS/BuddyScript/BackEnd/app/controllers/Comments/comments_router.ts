import router from "@adonisjs/core/services/router";

const CommentsController = () => import('./comments_controller.js')

router.group(() => {
  router.get('/comments/:id', [CommentsController, 'getCommentById'])
  router.get('/comments/:id/full', [CommentsController, 'getCommentWithRelations'])
  router.get('/comments/:id/replies', [CommentsController, 'getCommentReplies'])
  
  router.post('/comments', [CommentsController, 'createComment'])
  router.put('/comments/:id', [CommentsController, 'updateComment'])
  router.delete('/comments/:id', [CommentsController, 'deleteComment'])
  
  router.post('/comments/:id/like', [CommentsController, 'likeComment'])
  router.delete('/comments/:id/like', [CommentsController, 'unlikeComment'])
}).prefix('/api')