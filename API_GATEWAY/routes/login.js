const express =require('express');
const router = express.Router();
const controller = require('../controller/login_ctrl');

router.route('/login')
      .get(controller.login_page)  //'/login' login_page;
      .post(controller.login_request);  // '/login' login request
router.route('/logout')
      .get(controller.logout_page); //'/logout' logout page;
router.route('/login/register')
      .post(controller.login_create); //'/login/register' new member post

router.use('/auth',(req,res,next)=>{})

module.exports = router;
