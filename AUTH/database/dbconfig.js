const mysql = require('mysql2/promise');

( async()=>{
  //initialize database
  let connection = await mysql.createConnection({
    host:'localhost',
    user:'server',
    password:'server'
  });
  await connection.connect();
  await connection.on('error',err=>{
    console.log(err);
    return;
  });
  console.log("initializing database create");
  await connection.query('CREATE DATABASE IF NOT EXISTS auth');
  connection.end();
})();

module.exports={
  host:'localhost',
  user:'server',
  password:'server',
  database:'auth',
  connectionLimit:30,
};
