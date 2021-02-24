const mysql = require('mysql2');

//initialize database
let connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root'
});
connection.connect();
connection.on('error',err=>{
  console.log(err);
  return;
});
console.log("initializing database create");
connection.query('CREATE DATABASE IF NOT EXISTS board');
connection.end();

module.exports={
  host:'localhost',
  user:'root',
  password:'root',
  database:'board',
  connectionLimit:30,
};
