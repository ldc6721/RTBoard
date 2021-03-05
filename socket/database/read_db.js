const pool = require('./pool');

module.exports = {
  create_new_comment: async (board_name,index,nickname,uid,contents,time)=>{
    let conn = await pool.getConnection();
    try {
      //query to db
      await conn.beginTransaction();  //transaction start
      await conn.query(`insert into ${board_name}_comment
        (nickname,post_index,uid,comment,date)
        select '${nickname}','${index}','${uid}','${contents}','${time}' from dual
        where exists(select post_index from ${board_name} where post_index = ${index})
        `);
      let [cnt] = await conn.query(`select comment_index from ${board_name}_comment where post_index = ${index} order by comment_index DESC limit 1`);
      await conn.commit();  //transaction end
      conn.release();
      return cnt[0].comment_index;
    } catch (e) {
      await conn.rollback();
      conn.release();
      console.error(e);
    }
  },

  delete_one_comment: async (board_name,index,cmt_index,uid) => {
    let conn = await pool.getConnection();
    try {
      //query to db
      await conn.beginTransaction();  //start transaction
      let [result] = await conn.query(`update ${board_name}_comment
        set deleted = true
        where comment_index = ${cmt_index}`);
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
  }
};
