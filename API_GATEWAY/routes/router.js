const express =require('express');
const router = express.Router();
const controller = require('./ctrl');
const board = require('./board');   //main service
const login = require('./login');   //login service

//router.use(controller.check_token);

router.get('/',(req,res,next)=>{
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip);
  next();
});
router.use(board);
router.use(login);

module.exports = router;
