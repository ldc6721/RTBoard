const express =require('express');
const app = express();
const webSocket = require('./socket/socket'); //comment socket server
const port = 8086;  //chat server 확장 방법 생각해둘것

let server = app.listen(port,()=>{
  console.log(`comment web socket server is now listening in ${port}`);
});

webSocket(server);
