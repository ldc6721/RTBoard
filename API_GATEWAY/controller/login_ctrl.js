const axios = require('axios');
const baseurl = 'http://localhost:8084';
const setConfig = require('./axios_option');

module.exports= {
  login_page: (req,res,next)=>{
    try {
      axios(setConfig(req.method,baseurl + req.path,req.body,req.headers,req.session,req.sessionID))
      .then(response=>{
         if(response.headers.redirect) {
           //redirect
           res.redirect(response.data);
         }
         else {
           res.status(response.status).send(response.data);
         }
      });
    } catch (e) {
      console.error(e);
      return res.status(500).send("ERROR!");
    }
  },
  login_request: (req,res,next) => {
    try {
      axios(setConfig(req.method,baseurl + req.path,req.body,req.headers,req.session,req.sessionID))
      .then(response=>{
        if(response.data === "success") {
          res.status(response.status).json("success!");
        }
        else{
          //id not found,password incorrect,fail
          res.status(response.status).json(response.data);
        }
      });
    } catch (e) {
      console.error(e);
      return res.status(500).send("ERROR!");
    }
  },
  logout_page: (req,res,next)=> {
    try {
      if(req.session.login) {
        req.session.login = undefined;
      }
      if(req.headers.referer) {
        res.redirect(req.headers.referer);
      }
      else {
        res.redriect(basic_data.host_url);
      }
    } catch (e) {
      console.error(e);
      return res.status(500).send("ERROR!");
    }
  },
  login_create: (req,res,next)=> {
    try {
      axios(setConfig(req.method,baseurl + req.path,req.body,req.headers,req.session,req.sessionID))
      .then(response=>{
        res.status(response.status).json(response.data);
      })
    } catch (e) {
      console.error(e);
      return res.status(500).json("ERROR!");
    }
  },
}
