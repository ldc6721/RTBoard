const pool = require('./pool');

let get_time = (time) => {
  //time format redefinition
  let postTime = time.toFormat('YYYY-MM-DD');
  if (time.toFormat('YYYY-MM-DD') === new Date().toFormat('YYYY-MM-DD')) {
    postTime = time.toFormat('HH24:MI:SS');
  }
  return postTime;
};

let cnt_update = async (board_name, number, number2) => {
  let conn = pool.getConnection();
  try {
    //count update in boarddata collection
    //number is amount of post , number2 is amount of activated post(not deleted);
    await conn.beginTransaction();
    await conn.query(`update from board_data
      set postcnt = postcnt + ${number} and active_post = active_post + ${number2}
      where board_name = ${board_name}`);
    await conn.commit();
    conn.release();
  } catch (e) {
    await conn.rollback();
    conn.release();
    console.error(e);
  }
};

// let get_user_count = async (usercnt) => {
//   let iddata = await db("user", "userSchema");
//   return await iddata.countDocuments({});
// };

module.exports = {
  get_post: async (board_name, num, num2) => {
    //get recently post list in 'board_name' range in num and num2
    let post_list;
    let conn = await pool.getConnection();
    try {
      //query to db
      let [docs] = await conn.query(`select * from ${board_name}
        where deleted = false
        order by post_index desc limit ${num},${num2}`);
      conn.release();
      //범위의 수 보다 작은 경우 check
      var cnt = num2 < docs.length ? num2 : docs.length;
      post_list = new Array(cnt);
      //insert element
      for (var i = 0; i < post_list.length; i++) {
        post_list[i] = {
          index: docs[i].post_index,
          subject: docs[i].title,
          author: docs[i].author,
          date: get_time(docs[i].date),
          viewcnt: docs[i].viewcnt,
          goodcnt: docs[i].goodcnt
        }
      }
    } catch (e) {
      conn.release();
      console.error(e);
    }
    return post_list;
  },

  get_post_one: async (board_name, index) => {
    //get one post data
    let read_post;
    let conn = await pool.getConnection();
    try {
      //query to db
      let [response] = await conn.query(`select
        b.post_index as post_index,
        b.title as title,
        b.contents as contents,
        b.author as author,
        b.uid as uid,
        b.date as date,
        b.viewcnt as viewcnt,
        b.goodcnt as goodcnt,
        c.nickname as cmnickname,
        c.uid as cmuid,
        c.comment as cmcomment,
        c.date as cmdate,
        c.deleted as cmdeleted
        from ${board_name} b
        left join ${board_name}_comment c
        on b.post_index = c.post_index
        where b.post_index = ${index} and b.deleted = false`);
      if (response[0]) {
        //set post data
        let doc = response[0];
        //set comment data;
        let cmt = new Array();
        for(let element of response) {
          if(element.cmdeleted === null || element.cmdeleted){
            continue;
          }
          cmt.push({
            nickname:element.cmnickname,
            uid:element.cmuid,
            comment:element.cmcomment,
            date:element.cmdate
          });
        }
        //set return value
        read_post = {
          index: doc.post_index,
          subject: doc.title,
          contents: doc.contents,
          author: doc.author,
          uid: doc.uid,
          date: get_time(doc.date),
          viewcnt: doc.viewcnt,
          goodcnt: doc.goodcnt,
          comment: cmt
        };
        return read_post;
      }
      else {
        return ;
      }
    } catch (e) {
      conn.release();
      console.error(e);
      return;
    }
  },

  view_good_call: async (board_name, index, view_call, good_call) => {
    let conn = await pool.getConnection();
    try {
      //post good call
      let view_cnt = 0;
      if (view_call) {
        view_cnt = 1;
      };
      let good_cnt = 0;
      if (good_call) {
        good_cnt = 1;
      }
      //query to db
      await conn.beginTransaction();  //transaction start
      await conn.query(`update ${board_name}
        set viewcnt= viewcnt + ${view_cnt},goodcnt=goodcnt + ${good_cnt}
        where post_index = ${index}`);
      await conn.commit();  //transaction end
      conn.release();
    } catch (e) {
      await conn.rollback();
      conn.release();
      console.error(e);
    }
  },

  create_new_board: async (board_name) => {
    let conn = await pool.getConnection();
    try {
      //query to db
      await conn.beginTransaction();  //transaction start
      await conn.query(`insert into board_data
        (board_name)
        values('${board_name}')`);
        //create new board table
        await conn.query(`CREATE TABLE IF NOT EXISTS board (
          post_index INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          title varchar(255) NOT NULL,
          contents varchar(2048) NOT NULL,
          author varchar(255) NOT NULL,
          uid int NOT NULL,
          date datetime NOT NULL,
          viewcnt int default 0,
          goodcnt int default 0,
          deleted boolean default false
        )`);
        //create new comment table
        await conn.query(`CREATE TABLE IF NOT EXISTS board_comment (
          post_index int NOT NULL,
          nickname varchar(255) NOT NULL,
          uid int NOT NULL,
          comment varchar(255) NOT NULL,
          date datetime NOT NULL,
          deleted boolean default false,
          FOREIGN KEY (post_index) REFERENCES board(post_index)
        )`);
      await conn.commit();    //transaction end
      conn.release();
      return;
    } catch (e) {
      await conn.rollback();
      conn.release();
      console.error(e);
    }
  },

  create_new_post: async (board_name,title,contents,author,uid,time) => {
    let conn = await pool.getConnection();
    try {
      //query to db
      await conn.beginTransaction();  //transaction start
      //set board data
      await conn.query(`insert into ${board_name}
        (title,contents,author,uid,date)
        values('${title}','${contents}','${author}','${uid}','${time}')`);
      await conn.commit();    //transaction end
      conn.release();
    } catch (e) {
      await conn.rollback();
      conn.release();
      console.error(e);
    }
  },

  modify_post: async (board_name,index,title,contents) =>{
    let conn = await pool.getConnection();
    try {
      //query to db
      await conn.beginTransaction();  //transaction start
      await conn.query(`update ${board_name}
        set title = '${title}', contents = '${contents}'
        where index = ${index}`);
      await conn.commit();  //transaction end
      conn.release();
    } catch (e) {
      await conn.rollback();
      conn.release();
      console.error(e);
    }
  },

  create_new_comment: async (board_name,index,nickname,uid,contents,time)=>{
    let conn = await pool.getConnection();
    try {
      //query to db
      await conn.beginTransaction();  //transaction start
      await conn.query(`insert into ${board_name}.comment
        (nickname,post_index,uid,comment,date)
        select '${nickname}','${index}','${uid}','${contents}','${time}' from dual
        where exists(select post_index from ${board_name} where post_index = ${index})
        `);
      let cnt = conn.query(`select count(*) asc == cnt from ${board_name}.comment where post_index = ${index}`);
      await conn.commit();  //transaction end
      conn.release();
    } catch (e) {
      await conn.rollback();
      conn.release();
      console.error(e);
    }
    return cnt[0].cnt - 1;
  },

  delete_one_post: async (board_name,index) => {
    let conn = await pool.getConnection();
    try {
      //query to db
      await conn.beginTransaction();  //start transaction
      await conn.query(`UPDATE ${board_name}
        set deleted = true
        where post_index = ${index}`);
      await conn.commit();  //end transaction
      conn.release();
      cnt_update(board_name,0,-1);
    } catch (e) {
      await conn.rollback();
      conn.release();
      console.error(e);
    }
  },

  delete_one_comment: async (board_name,index,cmt_index,uid) => {
    let conn = await pool.getConnection();
    try {
      let cmt_idx = cmt_index.split('_')[2];
      //query to db

      await conn.beginTransaction();  //start transaction
      let [result] = await conn.query(`update ${board_name}_comment
        set deleted = true
        where post_index = ${index} and uid = ${uid}
        limit ${cmt_idx},1`);
      await conn.commit();
      conn.release();
      if(result[0]) {
        return true;
      }
      else {
        return false;
      }
    } catch (e) {
      await conn.rollback();
      conn.release();
      console.error(e);
      return false;
    }
  },

  get_board_cnt: async (board_name) =>{
    let conn = await pool.getConnection();
    try {
      //query to db
      let [result] = await conn.query(`select postcnt from board_data
        where board_name = '${board_name}'`);
      conn.release();
      if(result[0]){
        return result[0].postcnt;
      }
      else {
        return ;
      }
    } catch (e) {
      conn.release();
      console.error(e);
    }
  },
  get_board_data: async (board_name) =>{
    let conn =await pool.getConnection();
    try {
      //query to db
      if(board_name){
        let [result] = await conn.query(`select * from board_data
          where board_name = '${board_name}'`);
        conn.release();
        return result[0];
      }
      else {
        let [result] = await conn.query(`select * from board_data`);
        conn.release();
        return result;
      }
    } catch (e) {
      conn.release();
      console.error(e);
    }
  }
}
