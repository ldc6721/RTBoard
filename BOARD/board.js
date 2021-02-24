const express = require('express');
const app = express();
const port = 8085;
const path = require('path');
const cors = require('cors');
require('date-utils');
const ejs = require('ejs');
const router = require('./routes/router');
const bodyParser = require('body-parser');
//cross origin resource sharing
app.use(cors());

//set socket
const webSocket = require('./socket/socket');

//set ejs
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../ejs/views'));
//app.engine('html',require('ejs').renderFile); //html file rendering

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

app.use('/socket.io',(req,res,next)=>{
  console.log("test");
  next();
});

app.use('/',router);

const server = app.listen(port,()=>{
  console.log(`board service is listening now port at ${port}`);
});

webSocket(server);
