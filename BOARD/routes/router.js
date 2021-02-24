const express = require('express');
const router = express.Router();
const controller = require('./ctrl');


router.use('/',(req,res,next)=>{
  //parse session header
  req.headers.session = JSON.parse(req.headers.session);
  next();
})
router.route('/')
  .get(controller.main_page); //'/home'   home

router.route('/board')
  .get(controller.board_list_page) //'/board'  board list
  .post(controller.board_create); //'/board' create new board;

router.route('/board/:boardname')
  .get(controller.boardname_check, controller.board_post_list_page); // '/board' post list

router.route('/board/:boardname/write')
  .get(controller.boardname_check, controller.write_page) // '/write'   write post
  .post(controller.boardname_check,controller.write_post); //'/board/:boardname/write' write post ajax

router.route('/board/:boardname/:index')
  .get(controller.boardname_check, controller.read_page) // '/read'    read post
  .put(controller.boardname_check,controller.check_writer_post,controller.modify_post) //'/board/:boardname/:index/modify' modify post ajax
  .delete(controller.boardname_check,controller.check_writer_post,controller.delete_post); //'/board/:boardname/:index/delete' delete post ajax

router.route('/board/:boardname/modify/:index')
  .get(controller.boardname_check, controller.modify_page); // '/modify' modified post

router.use(controller.no_page);



module.exports = router;
