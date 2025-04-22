import router from "@adonisjs/core/services/router";

const RepliesController = () => import('./replies_controller.js')

router.group(() => {
  router.get('/replies/:id', [RepliesController, 'getReplyById'])
  router.get('/replies/:id/full', [RepliesController, 'getReplyWithRelations'])
  
  router.post('/replies', [RepliesController, 'createReply'])
  router.put('/replies/:id', [RepliesController, 'updateReply'])
  router.delete('/replies/:id', [RepliesController, 'deleteReply'])
  
  router.post('/replies/:id/like', [RepliesController, 'likeReply'])
  router.delete('/replies/:id/like', [RepliesController, 'unlikeReply'])
}).prefix('/api')