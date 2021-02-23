const pool = require('./pool.js');

module.exports = {
  //login_part
  get_login_data: async (id) => {
    try {
      let conn = await pool.getConnection();  //get db pool;
      let [row] = await conn.query(`select * from user where userid = ?`,id);
      conn.release(); //release db pool;
      if(row[0]) {
        return row[0];
      }
      else {
        return ;
      }
    } catch (e) {
      conn.release();
      return "error";
    }
  },
  create_login_data: async (id,ps,psbuf)=>{
    try {
      let conn = await pool.getConnection();  //get connection pool
      await conn.beginTransaction();  //set transaction
      let [row] = await conn.query(`select userid from user where userid = ?`,id);
      let return_val;
      if(row[0]){
        //duplicate id
        return_val = "duplicate";
      }
      else {
        //no duplicate id
        conn.query(`INSERT INTO user
          (userid,userps,userpsbuf)
          VALUES ('${id}','${ps}','${psbuf}')`);
        return_val = "success";
      }
      await conn.commit();  //commi transaction
      conn.release(); //release connection pool
      return return_val;
    } catch (e) {
      console.error(e);
      conn.rollback();
      conn.release();
      return "fail";
    }
  }
}
