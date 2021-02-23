const mysql = require('mysql2/promise');
const dbconfig = require('./dbconfig.js');
const pool = mysql.createPool(dbconfig);

(async ()=>{
  try {
    let conn = await pool.getConnection();
    //table initialize
    //user id table;
    conn.query(`CREATE TABLE IF NOT EXISTS user (
      uid INT AUTO_INCREMENT PRIMARY KEY,
      userid VARCHAR(25) UNIQUE KEY,
      userps VARCHAR(255),
      userpsbuf VARCHAR(255),
      admin VARCHAR(5) DEFAULT '')`
    );
    conn.release();
  } catch (e) {
    throw e;
  }
})();

module.exports = pool;
