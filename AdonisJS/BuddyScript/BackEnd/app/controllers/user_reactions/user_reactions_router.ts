import router from "@adonisjs/core/services/router";
import { middleware } from '#start/kernel';

const UserReactionsController = () => import('./user_reactions_controller.js');

router.group(() => {
  router.get('/user-reactions', [UserReactionsController, 'getUserReactions']).use(middleware.auth());
  router.get('/user-reactions/posts', [UserReactionsController, 'getPostReactions']).use(middleware.auth());
  router.get('/user-reactions/comments', [UserReactionsController, 'getCommentReactions']).use(middleware.auth());
  router.get('/user-reactions/replies', [UserReactionsController, 'getReplyReactions']).use(middleware.auth());
}).prefix('/api');