const axios = require('axios');
const baseurl = 'http://localhost:8085';
const setConfig = require('./axios_option');

module.exports = {
  check_login: async(req,res,next)=>{
    try {
      if(req.session.login) {
        next();
      }
      else {
        if(req.headers.referer) {
          res.redirect('req.headers.referer');
        }
        else {
          res.reidrect('/');
        }
      }
    } catch (e) {
      console.error('need login middleware error',e);
      res.status(500).send("paging error");
    };
  },
  get_page: async(req,res,next)=>{
    try {
      axios(setConfig(req.method,baseurl+req.path,req.body,req.headers,req.session))
      .then(response=>{
        res.send(response.data);
      });
    } catch (e) {
      console.error('get page error',e);
      res.status(500).send("get page error");
    }
  },
  post_message: async(req,res,next)=>{
    try {
      axios(setConfig(req.method,baseurl+req.path,req.body,req.headers,req.session))
      .then(response=>{
        res.json(response.data);
      });
    } catch (e) {
      console.error('post error',e);
      res.status(500).send("post error");
    }
  },
  // main_page: async(req,res,next)=>{
  //   try {
  //     axios(setConfig(req.method,baseurl+req.path,req.body,req.headers,req.session))
  //     .then(response=>{
  //       res.send(response.data);
  //     });
  //   } catch (e) {
  //     console.error(e);
  //     return res.status(500).send("gateway-error!");
  //   }
  // },
  // board_list_page: async(req,res,next)=>{
  //   try {
  //     axios(setConfig(req.method,baseurl+req.path,req.body,req.headers,req.session))
  //     .then(response=>{
  //       res.send(response.data);
  //     });
  //   } catch (e) {
  //     console.error(e);
  //     return res.status(500).send("gateway-error!");
  //   }
  // },
  // board_post_list_page: async(req,res,next)=>{
  //   try {
  //     axios(setConfig(req.method,baseurl+req.path,req.body,req.headers,req.session))
  //     .then(response=>{
  //       res.send(response.data);
  //     });
  //   } catch (e) {
  //     console.error(e);
  //     return res.status(500).send("gateway-error!");
  //   }
  // },
  // write_page:async(req,res,next)=>{
  //   try {
  //     if(req.session.login) {
  //       res.redirect(req.headers.referer);
  //     }
  //     axios(setConfig(req.method,baseurl+req.path,req.body,req.headers,req.session))
  //     .then(response=>{
  //       res.send(response.data);
  //     });
  //   } catch (e) {
  //     console.error(e);
  //     return res.status(500).send("gateway-error!");
  //   }
  // },
  // read_page:async(req,res,next)=>{
  //
  // },
  // modify_page:async(req,res,next)=>{
  //
  // },
  board_create:async(req,res,next)=>{

  },
  write_post: (req,res,next)=>{

  },
  modify_post: (req,res,next)=>{

  },
  delete_post: (req,res,next)=>{

  },

  //404 handling
  no_page: (req,res,next)=>{

  },
}
