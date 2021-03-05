const express =require('express');
const router = express.Router();
const controller = require('../controller/board_ctrl');

//router.use('/socket.io',controller.connect_socket);
router.route('/')
      .get(controller.get_page);

router.route('/board')
      .get(controller.get_page) //'/board'  board list
      .post(controller.post_message); //'/board' create new board;

router.route('/board/:boardname')
      .get(controller.get_page);  // '/board' post list

router.route('/board/:boardname/write')
      .get(controller.check_login,controller.get_page) // '/write'   write post
      .post(controller.check_login,controller.post_message); //'/board/:boardname/write' write post ajax

router.route('/board/:boardname/:index')
      .get(controller.get_page)  // '/read'    read post
      .put(controller.post_message)  //'/board/:boardname/:index/modify' modify post ajax
      .delete(controller.check_login,controller.post_message);  //'/board/:boardname/:index/delete' delete post ajax

router.route('/board/:boardname/modify/:index')
      .get(controller.check_login,controller.get_page); // '/modify' modified post

//upload_image
router.post('/board/:boardname/write/temporary_image',controller.upload_image_module);
module.exports = router;
