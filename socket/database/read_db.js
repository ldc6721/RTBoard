const pool = require('./pool');

module.exports = {
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

  get_session_data: async(session_id) => {
    //let model = await db("sessions","sessionSchema");
    //return await model.findOne({_id:session_id});

    return {session_data};
  }
};
