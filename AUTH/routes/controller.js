const read_db = require('../database/read_db');
const redis = require('../database/redis');
const crypto = require('crypto');
const basic_data = require('../data/basic_data');

// read_db.get_login_data();
// read_db.create_login_data("test","test ","test");
module.exports = {
  //get
  //main_page
  login_page: (req,res,next)=> {
    req.headers.session = JSON.parse(req.headers.session);
    if(req.headers.session.login){
      //already login data is in
      res.header('redirect',true);
      res.send(basic_data.host_url);
    }
    else {
      res.status(200).render('login_home');
    }
  },
  //post
  //login action
  login_request: async (req,res,next) => {
    try{
      let doc = await read_db.get_login_data(req.body.id);
      console.log("login request");
      if(!doc) {
        console.log("no data in DB!");
        return res.status(200).json("id not found");
      }
      crypto.pbkdf2(req.body.ps, doc.userpsbuf , 100000, 64, 'sha512', async (err,key)=>{
        if(key.toString('hex') == doc.userps){
          if(doc.admin) {
            console.log("관리자 로그인:",doc.userid);
            console.log("login success");
            res.json(await redis.set_login_data(req.headers.sessionid,doc.userid,doc.uid,doc.admin));
          }
          else {
            console.log("login success");
            res.json(await redis.set_login_data(req.headers.sessionid,doc.userid,doc.uid));
          }
        }
        else {
          console.log("password incorrect");
          res.json("password incorrect");
        }
      });
    }
    catch(e) {
      console.log(e);
      res.status(500).json("fail");
      //restart option
    }
  },
  //create action
  login_create: (req,res,next) => {
    console.log("register request");
    crypto.randomBytes(64, (err, buf) => {
      crypto.pbkdf2(req.body.ps, buf.toString('base64'), 100000, 64, 'sha512',  (err, key)=> {
        result = key.toString('hex');
        read_db.create_login_data(req.body.id,result,buf.toString('base64'))
        .then(response => {
          res.json(response);
        });
        //console.log(toString(result));
      });
    });
  }
}
