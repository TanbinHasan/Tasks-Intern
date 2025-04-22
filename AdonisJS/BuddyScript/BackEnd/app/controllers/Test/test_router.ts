import router from "@adonisjs/core/services/router";

const TestController = () => import('./test_controller.js')

router.group(() => {
  router.get('/users/:id', [TestController, 'testById'])
  router.get('users', [TestController, 'testAll'])
}).prefix('/api')