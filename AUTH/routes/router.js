const express =require('express');
const router = express.Router();
const controller = require('./controller');

// router.get('/',(req,res,next)=> {
//   //send help message;
//   res.send("help");
// });

//authentication
router.route('/login')
      .get(controller.login_page)  //'/login' login_page;
      .post(controller.login_request);  // '/login' login request
router.route('/login/register')
      .post(controller.login_create); //'/login/register' new member post

router.use((req,res,next)=> {
  res.status(500).send('invalid access');
});

module.exports = router;
