const mysql = require('mysql2/promise');
const dbconfig = require('./dbconfig.js');
const pool = mysql.createPool(dbconfig);

(async ()=>{
  try {
    let conn = await pool.getConnection();
    //table initialize
    //user id table;
    conn.query(`CREATE TABLE IF NOT EXISTS board_data (
      board_name varchar(255) NOT NULL PRIMARY KEY,
      current_board_num int default 0,
      postcnt INT DEFAULT 0,
      active_post INT DEFAULT 0
    )`);
    conn.release();
  }
  catch(e) {
    throw e;
  }
})();

module.exports = pool;
