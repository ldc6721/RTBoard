const read_db = require('../database/read_db');
const basic_data = require('../data/basic_data');

//error handling!
let err_handling = (number,req,res)=>{
  if(number === 404)
  {
    try{
      res.status(200).render('404',{
        nav: basic_data.nav_bar,
        host_url:basic_data.host_url,
        login_data:req.headers.session.login,
      });
    }
    catch(e) {
      console.log("error : ",e);
      res.send("error!");
      //res.status(500).send("error handling!");
    }
  }
  else if(number === 500)
  {
    res.status(500).send("something is broke...");
  }
}

module.exports = {
  main_page: async (req,res,next) => {
    try{
      //console.log(req.headers.session.login.id);
      //get all of board data
      let boarddata = await read_db.get_board_data();
      let board_name = new Array();
      let home_board = new Array();
      for(let element of boarddata){
        board_name.push(element.board_name);
        home_board.push(await read_db.get_post(element.board_name,0,7)); //게시물 7개까지 작성 가능
      }
      res.render('home', {
        nav: basic_data.nav_bar,
        host_url:basic_data.host_url,
        login_data:req.headers.session.login,
        board_name:board_name,
        home_board:home_board
      });
    }
    catch(e){
      console.log(e);
      err_handling(500,req,res);
    }
  },
  boardname_check: async(req,res,next) => {
    let data = await read_db.get_board_data(req.params.boardname);
    if(data){
      next();
    }
    else {
      err_handling(404,req,res);
    }
  },
  board_list_page: async (req,res,next) => {
    try {
      let board_data = await read_db.get_board_data();
      let board_list = new Array();
      board_data.forEach((element)=>{
        board_list.push({board_name:element.board_name,cnt:element.active_post});
      });
      console.log(req.headers.session.login);
      res.render('list',{
        nav: basic_data.nav_bar,
        host_url:basic_data.host_url,
        login_data:req.headers.session.login,
        board_list:board_list,
      });
    } catch (e) {
      console.log(e);
      err_handling(500,req,res);
    }
  },
  board_post_list_page: async (req, res, next) => {
    try {
      //paging system
      if (req.query.page === undefined) {
        //page = 1
        req.query.page = 1;
      }
      let cur_page = req.query.page;
      //get end page number
      let cnt = await read_db.get_board_cnt(req.params.boardname);
      let limit = 20; //1 page per document
      let end_page =  Math.ceil(cnt / limit);
      if(end_page == 0){
        //no post in board
        end_page = 1;
      }
      let start_page = Math.floor((cur_page - 1) / 10) * 10 + 1;

      //get current page
      let start = (req.query.page - 1) * limit;
      //console.time();
      let post_list = await read_db.get_post(req.params.boardname,start,limit);
      //console.timeEnd();

      //get DB page
      if(post_list&&cur_page&&start_page&&end_page)
      {
        res.render('board', {
          nav: basic_data.nav_bar,
          host_url:basic_data.host_url,
          login_data:req.headers.session.login,
          board_title: req.params.boardname,
          post_list: post_list,
          cur_page:cur_page,
          start_page:start_page,
          end_page:end_page
        });
      }
      else {
        err_handling(404,req,res);
      }
    } catch (e) {
      //error
      console.log(e);
      err_handling(500,req,res);
    }
  },

  write_page: (req, res, next) => {
    try {
      res.render('write', {
        nav: basic_data.nav_bar,
        host_url:basic_data.host_url,
        login_data:req.headers.session.login,
        board_title: req.params.boardname,
        modifycheck:false,
        read_post:{
          subject:"",
          contents:""
        },
      });
    } catch (e) {
      //error
      console.log(e);
      err_handling(500,req,res);
    }
  },

  read_page: async (req, res, next) => {
    try{
      let read_post = await read_db.get_post_one(req.params.boardname,req.params.index);
      if(read_post){
        //read_post contents setting
        read_post.contents = read_post.contents.split(/(?:\r\n|\r|\n)/g);
        //post view call
        read_db.view_good_call(req.params.boardname,req.params.index,true,false);
        //get read_post success
        res.render('read', {
          nav: basic_data.nav_bar,
          host_url:basic_data.host_url,
          login_data:req.headers.session.login,
          board_title: req.params.boardname,
          read_post: read_post,
          socketurl: basic_data.socket_url,
          socketid:req.headers.sessionid
        })
      }
      else {
        //fail to get read_post;
        err_handling(404,req,res);
      }
    }catch(e) {
      //error
      console.log(e);
      err_handling(500,req,res);
    }
  },

  modify_page: async(req,res,next)=>{
    try{
      console.log("test");
      var read_post = await read_db.get_post_one(req.params.boardname,req.params.index);
      if(read_post){
        res.render('modify', {
          nav: basic_data.nav_bar,
          host_url:basic_data.host_url,
          login_data:req.headers.session.login,
          board_title:req.params.boardname,
          modifycheck:true,
          read_post:read_post
        });
      }
    }
    catch(e) {
      //error
      console.log(e);
      err_handling(500,req,res);
    }
  },

  //POST
  board_create: async (req,res,next) => {
    try {
      if(req.body.board_name === /(?:boarddata|user|sessions)/g) {
        return res.json("사용할 수 없는 이름입니다.");
      }
      //overlap check;
      let result = await read_db.get_board_data(req.body.board_name);
      if(result){
        //console.log(result);
        return res.json("overlap");
      }
      read_db.create_new_board(req.body.board_name);
    }
    catch(e) {
      console.log("error : ",e);
      res.json("error!");
    }
  },
  write_post: (req, res, next) => {
    try {
      read_db.create_new_post(req.params.boardname,
      req.body.title,
    req.body.contents,
    req.headers.session.login.id,
    req.headers.session.login.uid,
  new Date().toFormat('YYYY-MM-DD HH24:MI:SS'));
  res.json("success!");
    } catch (e) {
      console.log("error : ", e);
      res.json("error!");
    };
  },
  check_writer_post:async (req,res,next)=>{
    try {
      if(req.headers.session.login.admin) {
        //admin user
        next();
      }
      else{
        //read_db control
        let result = await read_db.get_post_one(req.params.boardname,req.params.index);
        if(result.uid === req.headers.session.login.uid){
          //user authentication enabled
          next();
        }
        else {
          //user authentication disabled
          res.json("alert: user id is difference");
        }
      }
    } catch (e) {
      console.error(e);
      res.json("alert: 사용자 인증 실패");
    }
  },
  modify_post: (req,res,next) => {
    try {
      //read_db control
      read_db.modify_post(req.params.boardname,req.params.index,req.body.title,req.body.contents);
      res.json("success!");
    } catch (e) {
      console.log("error : ",e);
      res.json("error!");
    }
  },
  delete_post: (req,res,next) =>{
    try{
      console.log(`board name: ${req.params.boardname}  post index:${req.body.index} request for deletion has been received`);
      //deleting...
      read_db.delete_one_post(req.params.boardname,req.body.index);
      res.json("success!");
    }
    catch(e) {
      console.log("error : ", e);
      res.json("error!");
    };
  },



  //404 handling
  no_page: (req,res,next) =>{
    //console.log("500 handling");
    err_handling(500,req,res);
  }
}
