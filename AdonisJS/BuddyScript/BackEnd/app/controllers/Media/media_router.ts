import router from "@adonisjs/core/services/router";

const MediaController = () => import('./media_controller.js')

router.group(() => {
  router.get('/media/:id', [MediaController, 'getMediaById'])
  router.post('/media', [MediaController, 'createMedia'])
  router.put('/media/:id', [MediaController, 'updateMedia'])
  router.delete('/media/:id', [MediaController, 'deleteMedia'])
}).prefix('/api')